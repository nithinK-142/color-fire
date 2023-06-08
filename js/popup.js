const popup = document.getElementById('popup-wrapper');
const popUpBtn = document.getElementById('popup-btn');
const close = document.getElementById('close');
const colorList = document.getElementById('color-populate');
const titleHeader = document.querySelector('.title-wrapper h2');
const gridButton = document.getElementById('grid');
const listButton = document.getElementById('list');

listButton.classList.add('active');

//link grid css
const stylesheet = document.getElementById("gridLink");
const popupStyle = "../css/popup.css";
const gridStyle = "../css/popupGrid.css";
let isGrid = false;


popUpBtn.onclick = function () {
  popup.classList.add('show');
};

window.onclick = function (event) {
  if (event.target == popup) 
    popup.classList.remove('show');
};

function switchStyles(styles) {
  if (styles === "list") 
    stylesheet.href = popupStyle;
  else if(styles === "grid") 
    stylesheet.href = gridStyle;
}

gridButton.addEventListener('click', () => {
  isGrid = true;
  switchStyles("grid");
  gridButton.classList.add('active');
  listButton.classList.remove('active');
  titleHeader.textContent = 'Favorite Colors';
});

listButton.addEventListener('click', () => {
  isGrid = false;
  switchStyles("list");
  listButton.classList.add('active');
  gridButton.classList.remove('active');
  titleHeader.textContent = 'Favorite Colors';
});


//color Retrieved from firebase.
favoriteColorRef.on('value', (colorSnapshot, error) => {

  if (error) {
    console.error('Error retrieving favorite colors:', error);
    return;
  }

  const data = colorSnapshot.val();
  
  if (!data || Object.keys(data).length === 0) {
    colorList.innerHTML = '<p>No favorites yet.</p>';
    gridButton.style.display = 'none';
    listButton.style.display = 'none';
    return;
  }

  const sortedData = Object.entries(data).sort((a, b) => {
    const timestampA = new Date(a[1]).getTime();
    const timestampB = new Date(b[1]).getTime();
    return timestampB - timestampA; // Sort in descending order
  });



  const uniqueColors = {};

  colorList.innerHTML = '';
  gridButton.style.display = 'block';
  listButton.style.display = 'block';

  sortedData.forEach(([colorCode]) => {
    if (!uniqueColors[colorCode]) {
      uniqueColors[colorCode] = true;

      const colorEntry = document.createElement('span');
      colorEntry.classList.add('color-entry');

      // Create element for displaying color code and name
      const colorCodeElement = document.createElement('p');
      colorCodeElement.textContent = '#' + colorCode;

      // Add color code icon
      const colorCodeIcon = document.createElement('i');
      colorCodeIcon.classList.add('fa-solid', 'fa-arrow-up-from-bracket');
      colorCodeIcon.style.marginLeft = '10px'; 
      colorCodeElement.appendChild(colorCodeIcon);

      colorEntry.appendChild(colorCodeElement);

      // Create a container for the icons
      const iconContainer = document.createElement('div');
      iconContainer.classList.add('icon-container');

      // Add copy color icon
      const copyIconLink = document.createElement('a');
      copyIconLink.id = 'copyColor';
      copyIconLink.classList.add('copy-icon');
      const copyIcon = document.createElement('i');
      copyIcon.classList.add('fa-solid', 'fa-paste');
      copyIconLink.appendChild(copyIcon);
      iconContainer.appendChild(copyIconLink);

      // Add trash can icon
      const trashIconLink = document.createElement('a');
      trashIconLink.id = 'trashColor';
      trashIconLink.classList.add('trash-icon');
      const trashIcon = document.createElement('i');
      trashIcon.classList.add('fa-solid', 'fa-trash-can');
      trashIconLink.appendChild(trashIcon);
      iconContainer.appendChild(trashIconLink);

      colorEntry.appendChild(iconContainer);

      colorEntry.style.backgroundColor = '#' + colorCode;

      colorList.appendChild(colorEntry);

      colorCodeIcon.addEventListener('click', () => {
        hexColor.innerHTML = '#' + colorCode;
        container.style.backgroundColor = '#' + colorCode;
        setHeart();
      });

      copyIconLink.addEventListener('click', () => {
        copyColorToClipboard('#'+colorCode);
      });

      trashIconLink.addEventListener('click', () => {
        removeColor(colorCode);
      });
    }
  });
});


