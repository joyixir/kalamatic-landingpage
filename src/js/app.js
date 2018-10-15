$(document).ready(function () {
    $('.modal-trigger').leanModal();

    setTimeout(removeSplash, 3000);
});

function removeSplash() {
    $("#splash-overlay").remove()
}
