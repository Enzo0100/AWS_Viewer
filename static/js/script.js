document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/aws-resources');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Received non-JSON response");
        }

        const data = await response.json();
        console.log('Fetched Data:', data);  // Log the data for debugging

        const container = document.getElementById('mynetwork');
        container.innerHTML = '';  // Clear any existing content

        const iconBasePath = '/static/icons/';
        const iconMapping = {
            VPC: iconBasePath + 'VPC.png',
            Subnet: iconBasePath + 'Subnet.png',
            RDS: iconBasePath + 'RDS.png',
            Redis: iconBasePath + 'Redis.png',
            RabbitMQ: iconBasePath + 'RabbitMQ.png'
        };

        const getIconElement = (type, label) => {
            const iconElement = document.createElement('div');
            iconElement.className = 'icon-container';
            iconElement.innerHTML = `<img src="${iconMapping[type]}" alt="${type} icon" class="icon"/> ${label}`;
            return iconElement;
        };

        const formatDetails = (details, type) => {
            let formattedDetails = '';
            switch (type) {
                case 'VPC':
                    formattedDetails = `
                        <strong>VPC ID:</strong> ${details.VpcId}<br>
                        <strong>State:</strong> ${details.State}<br>
                        <strong>CIDR Block:</strong> ${details.CidrBlock}
                    `;
                    break;
                case 'Subnet':
                    formattedDetails = `
                        <strong>Subnet ID:</strong> ${details.SubnetId}<br>
                        <strong>VPC ID:</strong> ${details.VpcId}<br>
                        <strong>State:</strong> ${details.State}<br>
                        <strong>CIDR Block:</strong> ${details.CidrBlock}
                    `;
                    break;
                case 'RDS':
                    formattedDetails = `
                        <strong>DB Instance Identifier:</strong> ${details.DBInstanceIdentifier}<br>
                        <strong>DB Instance Class:</strong> ${details.DBInstanceClass}<br>
                        <strong>Engine:</strong> ${details.Engine}<br>
                        <strong>DB Instance Status:</strong> ${details.DBInstanceStatus}
                    `;
                    break;
                case 'Redis':
                    formattedDetails = `
                        <strong>Cache Cluster ID:</strong> ${details.CacheClusterId}<br>
                        <strong>Engine:</strong> ${details.Engine}<br>
                        <strong>Status:</strong> ${details.CacheClusterStatus}
                    `;
                    break;
                case 'RabbitMQ':
                    formattedDetails = `
                        <strong>Broker ID:</strong> ${details.BrokerId}<br>
                        <strong>Broker Name:</strong> ${details.BrokerName}<br>
                        <strong>Status:</strong> ${details.BrokerState}
                    `;
                    break;
                default:
                    formattedDetails = JSON.stringify(details, null, 2);
            }
            return formattedDetails;
        };

        const showModal = (details, type) => {
            const modal = document.getElementById('detailModal');
            const modalDetails = document.getElementById('modalDetails');
            modalDetails.innerHTML = formatDetails(details, type);
            modal.style.display = 'block';
            document.getElementById('modalBackdrop').style.display = 'block';
        };

        const closeModal = () => {
            const modal = document.getElementById('detailModal');
            modal.style.display = 'none';
            document.getElementById('modalBackdrop').style.display = 'none';
        };

        document.querySelector('.close-button').addEventListener('click', closeModal);

        const addClickEvent = (element, details, type) => {
            element.addEventListener('click', () => {
                showModal(details, type);
            });
        };

        // Create VPC containers and append subnets and resources to them
        data.VPCs.forEach(vpc => {
            const vpcName = vpc.VpcName || vpc.VpcId;
            const vpcContainer = document.createElement('div');
            vpcContainer.className = 'vpc-container';
            const vpcElement = getIconElement('VPC', vpcName);
            addClickEvent(vpcElement, vpc, 'VPC');
            vpcContainer.appendChild(vpcElement);

            data.Subnets.filter(subnet => subnet.VpcId === vpc.VpcId).forEach(subnet => {
                const subnetContainer = document.createElement('div');
                subnetContainer.className = 'subnet-container';
                const subnetElement = getIconElement('Subnet', `Subnet: ${subnet.SubnetId}`);
                addClickEvent(subnetElement, subnet, 'Subnet');
                subnetContainer.appendChild(subnetElement);

                data['RDS Instances'].filter(rds => rds.DBSubnetGroup && rds.DBSubnetGroup.VpcId === vpc.VpcId).forEach(rds => {
                    if (rds.DBInstanceIdentifier && rds.DBSubnetGroup.Subnets.some(sub => sub.SubnetIdentifier === subnet.SubnetId)) {
                        const rdsElement = document.createElement('div');
                        const rdsIconElement = getIconElement('RDS', `RDS: ${rds.DBInstanceIdentifier}`);
                        addClickEvent(rdsIconElement, rds, 'RDS');
                        rdsElement.appendChild(rdsIconElement);
                        subnetContainer.appendChild(rdsElement);
                    }
                });

                data['Redis Clusters'].filter(cluster => cluster.CacheSubnetGroup && cluster.CacheSubnetGroup.VpcId === vpc.VpcId).forEach(cluster => {
                    if (cluster.CacheClusterId && cluster.CacheSubnetGroup.Subnets.some(sub => sub.SubnetIdentifier === subnet.SubnetId)) {
                        const redisElement = document.createElement('div');
                        const redisIconElement = getIconElement('Redis', `Redis: ${cluster.CacheClusterId}`);
                        addClickEvent(redisIconElement, cluster, 'Redis');
                        redisElement.appendChild(redisIconElement);
                        subnetContainer.appendChild(redisElement);
                    }
                });

                data['RabbitMQ Brokers'].filter(broker => broker.VpcId === vpc.VpcId).forEach(broker => {
                    if (broker.BrokerId && broker.SubnetIds.includes(subnet.SubnetId)) {
                        const mqElement = document.createElement('div');
                        const mqIconElement = getIconElement('RabbitMQ', `RabbitMQ: ${broker.BrokerId}`);
                        addClickEvent(mqIconElement, broker, 'RabbitMQ');
                        mqElement.appendChild(mqIconElement);
                        subnetContainer.appendChild(mqElement);
                    }
                });

                vpcContainer.appendChild(subnetContainer);
            });

            container.appendChild(vpcContainer);
        });
    } catch (error) {
        console.error('Error fetching or processing data:', error);
    }
});
