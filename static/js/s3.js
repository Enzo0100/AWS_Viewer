document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/s3-buckets');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("Received non-JSON response");
        }

        const data = await response.json();
        console.log('Fetched Data:', data);  // Log the data for debugging

        const container = document.getElementById('s3buckets');
        container.innerHTML = '';  // Clear any existing content

        const iconBasePath = '/static/icons/';
        const iconMapping = {
            S3: iconBasePath + 'S3.png'
        };

        const getIconElement = (type, label) => {
            const iconElement = document.createElement('div');
            iconElement.className = 'icon-container';
            iconElement.innerHTML = `<img src="${iconMapping[type]}" alt="${type} icon" class="icon"/> ${label}`;
            return iconElement;
        };

        const formatDetails = (details, type) => {
            let formattedDetails = '';
            if (type === 'S3') {
                formattedDetails = `
                    <strong>Bucket Name:</strong> ${details.Name}<br>
                    <strong>Creation Date:</strong> ${details.CreationDate}
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

        // Create cards for each S3 bucket
        data.forEach(bucket => {
            const card = document.createElement('div');
            card.className = 'card';

            const img = document.createElement('img');
            img.src = iconMapping['S3'];
            img.alt = 'S3 icon';

            const content = document.createElement('div');
            content.className = 'card-content';

            const title = document.createElement('div');
            title.className = 'card-title';
            title.textContent = bucket.Name;

            const description = document.createElement('div');
            description.className = 'card-description';
            description.textContent = `Creation Date: ${bucket.CreationDate}`;

            const button = document.createElement('button');
            button.className = 'card-button';
            button.textContent = 'View Details';
            button.addEventListener('click', () => showModal(bucket, 'S3'));

            content.appendChild(title);
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
