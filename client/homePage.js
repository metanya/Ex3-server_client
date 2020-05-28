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
                        <button id="${data[i][0]}-${i + 1}" type="button" onClick="addPictures(${data[i][0]})">
                            Add Picture
                        </button>
                        <button id="${data[i][0]}-${i + 2}" type="button" onClick="deleteAlbum(${data[i][0]})">
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
                <button id="createAlbumBtn" class="btn btn-warning" onClick="createAlbum()">
                    CreateAlbum
                </button>
            </div>`;
    $("#albumListSec").replaceWith(
        `<div id="AlbumsDataList">${albumList}</div>`
    );
}

onLoad = function() {
    createTableWithAlbums();
};

$("document").ready(onLoad);