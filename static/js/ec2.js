document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/ec2-instances');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Received non-JSON response");
        }

        const data = await response.json();
        console.log('Fetched Data:', data);  // Log the data for debugging

        const container = document.getElementById('ec2instances');
        container.innerHTML = '';  // Clear any existing content

        const iconBasePath = '/static/icons/';
        const iconMapping = {
            EC2: iconBasePath + 'EC2.png'
        };

        const getIconElement = (type, label) => {
            const iconElement = document.createElement('div');
            iconElement.className = 'icon-container';
            iconElement.innerHTML = `<img src="${iconMapping[type]}" alt="${type} icon" class="icon"/> ${label}`;
            return iconElement;
        };

        const getInstanceName = (tags) => {
            if (tags) {
                const nameTag = tags.find(tag => tag.Key === 'Name');
                return nameTag ? nameTag.Value : null;
            }
            return null;
        };

        const formatDetails = (details, type) => {
            let formattedDetails = '';
            if (type === 'EC2') {
                const instanceName = getInstanceName(details.Tags) || details.InstanceId;
                formattedDetails = `
                    <strong>Instance ID:</strong> ${details.InstanceId}<br>
                    <strong>Instance Name:</strong> ${instanceName}<br>
                    <strong>Instance Type:</strong> ${details.InstanceType}<br>
                    <strong>State:</strong> ${details.State.Name}
                `;
            } else {
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

        // Create cards for each EC2 instance
        data.forEach(instance => {
            const card = document.createElement('div');
            card.className = 'card';

            const img = document.createElement('img');
            img.src = iconMapping['EC2'];
            img.alt = 'EC2 icon';

            const content = document.createElement('div');
            content.className = 'card-content';

            const instanceName = getInstanceName(instance.Tags) || instance.InstanceId;
            const title = document.createElement('div');
            title.className = 'card-title';
            title.textContent = instanceName;

            const id = document.createElement('div');
            id.className = 'card-id';
            id.textContent = `ID: ${instance.InstanceId}`;

            const description = document.createElement('div');
            description.className = 'card-description';
            description.textContent = `State: ${instance.State.Name}`;

            const button = document.createElement('button');
            button.className = 'card-button';
            button.textContent = 'View Details';
            button.addEventListener('click', () => showModal(instance, 'EC2'));

            content.appendChild(title);
            content.appendChild(id);
            content.appendChild(description);
            card.appendChild(img);
            card.appendChild(content);
            card.appendChild(button);

            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching or processing data:', error);
    }
});
