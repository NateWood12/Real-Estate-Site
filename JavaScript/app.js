let properties = [];
const urlParams = new URLSearchParams(window.location.search);
const propertyId = parseInt(urlParams.get('id')) || 1; // default property
async function fetchProperties() {
    try {
        const response = await fetch('./json/properties.json'); 
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        properties = await response.json(); 
        console.log(properties);
        loadProperty(); 
    } catch (error) {
        console.error('Fetch error: ', error);
    }
}

fetchProperties();

// load property according to url
function loadProperty() {
    
 
    const property = properties.find(p => p.id === propertyId);
    if (property) {
        document.getElementById('property-address').innerText = property.address;
        document.getElementById('property-price').innerText = property.price;
        document.getElementById('beds').innerText = property.beds;
        document.getElementById('baths').innerText = property.baths;
        document.getElementById('sqft').innerText = property.sqft;
        document.getElementById('description').innerText = property.description;
        document.getElementById('developer').innerText = property.developer;
 
        // highlights
        const icons = [
            './Images/Icons/parking.jpg', 
            './Images/Icons/outdoor.jpg',  
            './Images/Icons/heating.jpg',
            './Images/Icons/hoa-fee.jpg',  
            './Images/Icons/days-on-market.jpg',  
            './Images/Icons/square-feet.jpg'
        ];
        
        property.highlights.forEach((highlight, index) => {
            const li = document.createElement('li');
        
            const img = document.createElement('img');
            img.src = icons[index]; 
            img.alt = 'Icon'; 
            img.style.width = '20px'; 
            img.style.height = '20px';
            
            li.appendChild(img);
            
            const textNode = document.createTextNode(` ${highlight}`);
            li.appendChild(textNode);
            
            document.getElementById('highlights').appendChild(li);
        });
        
 
        // interior details
        property.interiorDetails.forEach(detail => {
            const li = document.createElement('li');
            li.innerText = detail;
            document.getElementById('interior-details').appendChild(li);
        });
        
        document.getElementById('main-image').src = property.images[0];
        for (let i = 0; i < property.images.length; i++) {
            const image = property.images[i];
            const img = document.createElement('img');
            img.src = image;
            img.onclick = () => viewImage(image);
            document.querySelector('.thumbnails').appendChild(img);
        
            if (i === 2) { // Stop after appending 3 images (index 2 is the third image)
                break;
            }
        }
        
 
       // similar homes
    property.similarHomes.forEach((similar, index) => {
        const div = document.createElement('div');
        let imageUrl = ""
        if (propertyId == 1){
            imageUrl = similar.imageUrl || `./Images/similarHomes/similarHome${index + 2}.jpg`;
        }
        if (propertyId == 2){
            imageUrl = similar.imageUrl || `./Images/similarHomes/similarHome${index + 1}.jpg`;
        }
        if (propertyId == 3){
            imageUrl = similar.imageUrl || `./Images/similarHomes/similarHome${index}.jpg`;
        }
        div.innerHTML = `<img src="${imageUrl}" alt="${similar.address}">
                        <p>${similar.address}</p>
                         <p>Price: $${similar.price}</p>
                         <p>Beds: ${similar.beds}, Baths: ${similar.baths}, Sqft: ${similar.sqft}</p>`;
        div.onclick = () => loadSimilarProperty(similar.id);
    
        document.getElementById('similar-homes').appendChild(div);
    });

 
        // taxes (yucky)
        const taxesTable = document.getElementById('taxes-table');
        taxesTable.innerHTML = "<tr><th>Year</th><th>Tax</th><th>Assessment</th></tr>";
        property.taxes.forEach(tax => {
            const row = `<tr><td>${tax.year}</td><td>${tax.tax}</td><td>${tax.assessment}</td></tr>`;
            taxesTable.innerHTML += row;
        });
 
        // affordability default
        document.getElementById('down-payment').onchange = calculatePayment;
        document.getElementById('interest-rate').onchange = calculatePayment;
        calculatePayment();
    }
}

// view all pics
function viewAllImages() {
    const modal = document.getElementById('image-modal');
    const modalContainer = document.getElementById('modal-image-container');

    // Clear any previous images
    modalContainer.innerHTML = '';

    // Get the current property's images
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = parseInt(urlParams.get('id')) || 1;
    const property = properties.find(p => p.id === propertyId);

    if (property && property.images.length > 0) {
        property.images.forEach(imageUrl => {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Property Image';
            img.onclick = () => viewImage(imageUrl); // full size
            modalContainer.appendChild(img);
        });
    } else {
        const noImagesMessage = document.createElement('p');
        noImagesMessage.innerText = "No images available for this property.";
        noImagesMessage.style.color = "#fff";
        modalContainer.appendChild(noImagesMessage);
    }

    // show the modal
    modal.style.display = 'block';
}
function viewImage(image) {
    imageUrl = image
    const overlay = document.createElement('div');
    overlay.id = 'image-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '1000';

    const largeImage = document.createElement('img');
    largeImage.src = imageUrl;
    largeImage.alt = image.alt || "Large view of the image";
    largeImage.style.maxWidth = '90%';
    largeImage.style.maxHeight = '90%';
    largeImage.style.borderRadius = '8px';

    const closeButton = document.createElement('span');
    closeButton.innerText = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '20px';
    closeButton.style.right = '20px';
    closeButton.style.fontSize = '24px';
    closeButton.style.color = 'white';
    closeButton.style.cursor = 'pointer';
    closeButton.style.zIndex = '1001';
    
    closeButton.onclick = () => document.body.removeChild(overlay);
    overlay.appendChild(largeImage);
    overlay.appendChild(closeButton);
    document.body.appendChild(overlay);
}

// close the model
function closeModal() {
    const modal = document.getElementById('image-modal');
    modal.style.display = 'none';
}

// close modal
window.onclick = function(event) {
    const modal = document.getElementById('image-modal');
    if (event.target == modal) {
        closeModal();
    }
};
 
// load similar property
function loadSimilarProperty(id) {
    window.location.href = `?id=${id}`;
}
 
// affordability calc
function calculatePayment() {
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = parseInt(urlParams.get('id')) || 1;
    const property = properties.find(p => p.id === propertyId);

    if (!property) {
        console.error('Property not found');
        return;
    }

    // parse price, remove $ and commas
    const price = parseFloat(property.price.replace(/[^0-9.-]+/g, ""));
    if (isNaN(price)) {
        console.error('Invalid property price');
        return;
    }

    // get stuff
    const downPayment = parseFloat(document.getElementById('down-payment').value);
    const downPaymentPercentage = downPayment / price;
    const interestRate = parseFloat(document.getElementById('interest-rate').value) / 100 / 12; // monthly interest rate

    if (isNaN(downPaymentPercentage) || isNaN(interestRate)) {
        console.error('Invalid input for down payment or interest rate');
        return;
    }

    // calc after down
    const loanAmount = price - downPayment;
    const loanTerm = 30 * 12; // 30 years in months

    // calc (short for calculator)
    const monthlyPayment = (loanAmount * interestRate) / (1 - Math.pow(1 + interestRate, -loanTerm));

    document.getElementById('monthly-payment').innerText = `$${monthlyPayment.toFixed(2)}`;
}
 
// load property
window.onload = loadProperty;