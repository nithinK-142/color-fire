const dialog = document.getElementById('dialogBtn');
const about = document.getElementById('about');
const btn = document.getElementById('alright');

dialog.addEventListener('click', function () {
    document.body.style.filter = "blur(5px)";
    about.showModal();
});

document.addEventListener('click', function (event) {
    if (event.target === btn || (event.target !== dialog && !dialog.contains(event.target))) {
        document.body.style.filter = "none";
        about.close();
    }
});

