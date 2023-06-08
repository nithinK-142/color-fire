let container = document.querySelector('.container');
let button = document.querySelector('.button-85');
let heartIcon = document.getElementById('heart');
let hexColor = document.querySelector('.hexColor');
let clipboardIcon = document.getElementById('clipboard');

let clipboardTimeout;

const hexDecimalLength = 6;

const timestamp = new Date().toLocaleString();

const originalHeartColor = getComputedStyle(heartIcon).color;
const originalClipboardColor = getComputedStyle(clipboardIcon).color;

const userId = 'user';
const favoriteColorRef = database.ref(`${userId}/favoriteColors`);

function randomIntegerGenerator(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function genRandomColor() {
  let color = '#';
  const chars = '0123456789ABCDEF';

  for (let i = 0; i < hexDecimalLength; i++) {
    let getRandomColor = chars.charAt(randomIntegerGenerator(0, 15));
    color += getRandomColor;
  }

  hexColor.innerHTML = color;
  container.style.backgroundColor = color;
  clipboardIcon.addEventListener('click', copyColor);
}

//Heart
function saveColor() {
  const hex = hexColor.innerHTML.substr(1);

  if (heartIcon.classList.contains('clicked')) 
    removeColor(hex);
  else {
    setHeart();
    favoriteColorRef.child(hex).set(timestamp)
      .then(() => {
        console.log('Hex color saved to Firebase:', hex);
      })
      .catch((error) => {
        console.error('Failed to save hex color to Firebase:', error);
      });
  }
}

function removeColor(targetColorCode) {
  favoriteColorRef.child(targetColorCode).remove()
    .then(() => {
      // alert("Color Removed From Favorites!")
      console.log('Color removed from firebase.');
    })
    .catch((error) => {
      console.error('Error removing color from firebase!', error);
    });
    resetHeart();
}

function setHeart() {
  heartIcon.style.color = 'red';
  heartIcon.classList.add('clicked');
}

function resetHeart() {
  heartIcon.style.color = originalHeartColor;
  heartIcon.classList.remove('clicked');
}


//Clipboard
function copyColor() {
  if (clipboardIcon.classList.contains('clicked')) {
    clearTimeout(clipboardTimeout);
    resetClipboard();
  } 
  else {
    setClipboard();

    const hex = hexColor.innerHTML;

    clipboardIcon.removeEventListener('click', copyColor);

    copyColorToClipboard(hex)
      .then(() => {
        console.log('Hex color copied to clipboard:', hex);
        clipboardTimeout = setTimeout(() => {
          resetClipboard();
          clipboardIcon.addEventListener('click', copyColor);
        }, 2000);
      })
      .catch((error) => {
        console.error('Failed to copy hex color to clipboard:', error);
        resetClipboard();
        clipboardIcon.addEventListener('click', copyColor);
      });
  }
}

function copyColorToClipboard(copyColor) {
  return navigator.clipboard.writeText(copyColor);
}

function setClipboard() {
  clipboardIcon.style.color = '#32CD32';
  clipboardIcon.classList.remove('fa-clipboard');
  clipboardIcon.classList.add('fa-clipboard-check');
  clipboardIcon.classList.add('clicked');
}

function resetClipboard() {
  clearTimeout(clipboardTimeout);
  clipboardIcon.style.color = originalClipboardColor;
  clipboardIcon.classList.remove('fa-clipboard-check');
  clipboardIcon.classList.add('fa-clipboard');
  clipboardIcon.classList.remove('clicked');
}


//darkreader-blocker
const lock = document.createElement('meta');
lock.name = 'darkreader-lock';
document.head.appendChild(lock);


//Listeners
button.addEventListener('click', function() {
  genRandomColor();
  resetHeart();
  resetClipboard();
});

heartIcon.addEventListener('click', saveColor);

clipboardIcon.addEventListener('click', copyColor);

genRandomColor();

