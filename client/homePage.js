function createTableWithAlbums() {
    $.ajax({
        url: "http://localhost:3001/albums",
        success: function(data) {
            var albumsList = [];
            $.each(data, function(index, entry) {
                var albumArr = [];
                albumArr.push(index);
                albumArr.push(entry.name);
                albumArr.push(entry.type);
                var picture = [];
                $.each(entry.pictures, function(picIndex, picEntry) {
                    var pic = [];
                    pic.push(picEntry.name);
                    pic.push(picEntry.link);
                    pic.push(picEntry.photographer);
                    pic.push(picEntry.id);
                    picture.push(pic);
                });
                albumArr.push(picture);
                albumsList.push(albumArr);
            });
            createAlbumList(albumsList);
        },
        error: function() {
            $("#errorSpace").replaceWith(
                `<div id="errorSpace">Error, failed to load the Album list</div>`
            );
        },
    });
}

function createAlbumList(data) {
    let albumList =
        `<table>
            <thead>
                <tr>
                    <th id="TABLE_HEAD_number" class="middle">#</th>
                    <th id="TABLE_HEAD_name" class="middle">Album Name:</th>
                    <th id="TABLE_HEAD_type" class="middle">Album Type:</th>
                    <th id="TABLE_HEAD_buttons" class="middle">Links:</th>
                </tr>
            </thead>
            <tbody>`;
    for (i = 0; i < data.length; i++) {
        albumList +=
            `<tr>
                <th class="TABLE_ROW_number middle" scope="row">${i + 1}</th>
                <td class="TABLE_ROW_name middle">${data[i][1]}</td>
                <td class="TABLE_ROW_type middle">${data[i][2]}</td>
                <td class="TABLE_ROW_buttons">
                    <div id="editBtn">
                        <button id="${data[i][0]}-${i}" type="button" onClick="viewPictures(${data[i][0]})">
                            View Pictures List
                        </button>
                        <button id="${data[i][0]}-${i + 1}" type="button" data-toggle="modal" data-target="#photoForm" onClick="createAddPhotoForm(${data[i][0]})">
                            Add Picture
                        </button>
                        <button id="${data[i][0]}-${i + 2}" type="button" data-toggle="modal" data-target="#deleteAlbum" onClick="deleteAlbum(${data[i][0]})">
                            Delete Album
                        </button>
                    </td>
                </div>
            </tr>`;
    }
    albumList +=
        ` </tbody>
        </table>
            <div id="createAlbum">
                <button id="createAlbumBtn" class="btn btn-warning" data-toggle="modal" data-target="#addAlbum" onClick="createAlbum()">
                    CreateAlbum
                </button>
            </div>`;
    $("#albumListSec").replaceWith(
        `<div id="AlbumsDataList">${albumList}</div>`
    );
}

function viewPictures(id) {

    $.ajax({
        url: "http://localhost:3001/albums/" + id,
        success: function(data) {
            var links = [];
            $.each(data.pictures, function(index, entry) {
                let i = index - 1;
                links.push(entry.link);
            });
            createPhotosSlider(links);
        },
        error: function() {
            $("#errorSpace").replaceWith(
                `<div id="errorSpace">Error, failed to load the photos slider.</div>`
            );
        },
    });
}

function createPhotosSlider(links) {
    let slideShow = `
    <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
  <ol class="carousel-indicators">
    <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
  </ol>
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img class="d-block w-100" src="${links[0]}" >
    </div>`;

    for (i = 1; i < links.length; i++) {
        slideShow += `
    <div class="carousel-item">
      <img class="d-block w-100" src="${links[i]}" >
    </div>
    `;
    }

    slideShow += `
         </div>
         <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
             <span class="sr-only">Previous</span>
             </a>
        <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
         <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
        </a>
        </div>`;
    //     `<div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
    //         <ol class="carousel-indicators">
    //             <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
    //             <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
    //             <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
    //         </ol>
    //         <div class="carousel-inner">`;

    // for (i = 0; i < links.length; i++) {
    //     slideShow +=
    //         `<div class="carousel-item active">
    //                 <img class="d-block w-100 normalSize" src="${links[i]}" alt="First slide">
    //             </div>`;
    // }

    // slideShow +=
    //     `</div>
    //         <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
    //             <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    //             <span class="sr-only">Previous</span>
    //         </a>
    //         <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
    //             <span class="carousel-control-next-icon" aria-hidden="true"></span>
    //             <span class="sr-only">Next</span>
    //         </a>
    //     </div>`;

    $("#showPhotos").replaceWith(
        `<div id="showPhotos">${slideShow}</div>`
    );
}

function createAddPhotoForm(id) {
    $("form[name='photo_form']").validate({
        rules: {
            id_field: {
                required: true,
            },
        },
        messages: {},
    });
    $("#photo_form").submit(function(event) {
        if (!$("#photo_form").valid()) return;
        $.ajax({
            type: "POST", // define the type of HTTP verb we want to use (POST for our form)
            url: "http://localhost:3001/albums/" + id, // the url where we want to POST
            contentType: "application/json",
            data: JSON.stringify({
                name: $("#photoFormName").val(),
                link: $("#photoFormLink").val(),
                photographer: $("#photoFormPhotographer").val(),
                id: "",
            }),
            processData: false,
            encode: true,
            success: function(data, textStatus, jQxhr) {
                // $('#albumModalPreview').modal('hide');
                location.reload(); // need to find how to reload only div
            },
            error: function(jqXhr, textStatus, errorThrown) {
                $("#errorSpace").replaceWith(
                    `<div id="errorSpace">Error, failed to load the Album list</div>`
                );
            },
        });
        event.preventDefault();
    });
}

function createAlbum() {
    $("form[name='albumForm']").validate({
        rules: {
            id_field: {
                required: true,
            },
        },
        messages: {},
    });
    $("#albumForm").submit(function(event) {
        if (!$("#albumForm").valid()) return;
        $.ajax({
            type: "POST", // define the type of HTTP verb we want to use (POST for our form)
            url: "http://localhost:3001/albums", // the url where we want to POST
            contentType: "application/json",
            data: JSON.stringify({
                name: $("#photoFormName").val(),
                type: $("#albumFormType").val(),
                id: "",
                pictures: {},
            }),
            processData: false,
            encode: true,
            success: function(data, textStatus, jQxhr) {
                // $('#albumModalPreview').modal('hide');
                location.reload(); // need to find how to reload only div
            },
            error: function(jqXhr, textStatus, errorThrown) {
                $("#errorSpace").replaceWith(
                    `<div id="errorSpace">Error, failed to load the Album list</div>`
                );
            },
        });
        event.preventDefault();
    });
}

function deleteAlbum(id) {
    bootbox.confirm({
        title: "Delete Album?",
        message: "Are you sure you want to delete this album?",
        buttons: {
            cancel: {
                label: 'Cancel',
            },
            confirm: {
                label: 'Confirm',
            },
        },
        callback: function(result) {
            if (result) {
                $.ajax({
                    url: "http://localhost:3001/albums/" + id,
                    type: "DELETE",
                    success: function(data) {
                        location.reload();
                    },
                    error: function() {
                        $("#test").replaceWith(
                            `<div id="errorLoadAlbumList">Error, failed to load the Album list</div>`
                        );
                    },
                });
            }
        },
    });
}

function loadPictureForm() {
    $("#PictureForm").load("http://localhost:3001/addPhoto");
}

function loadAlbumForm() {
    $("#AlbumForm").load("http://localhost:3001/addAlbum");
}

onLoad = function() {
    createTableWithAlbums();
    loadPictureForm();
    loadAlbumForm();
};

$("document").ready(onLoad);