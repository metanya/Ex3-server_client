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
                    <th id="number">#</th>
                    <th id="albumName">Album Name:</th>
                    <th id="albumType">Album Type:</th>
                    <th id="buttons">Links:</th>
                </tr>
            </thead>
            <tbody>`;
    for (i = 0; i < data.length; i++) {
        albumList += `<tr>
                            <th scope="row">${i + 1}</th>
                            <td class="rowName">${data[i][1]}</td>
                            <td class="rowType">${data[i][2]}</td>
                            <td><div id="editBtm">
                            <button id="${
                                data[i][0]
                            }-${i}" type="button" class="btn btn-secondary btn-sm buttonDesign" onClick="viewPictures(${
                                data[i][0]
            })">View Pictures List</button>
                            <button id="${data[i][0]}-${
              i + 1
            }" type="button" class="btn btn-secondary btn-sm buttonDesign" data-toggle="modal" data-target="#pictureModalPreview" onClick="addPictures(${
                data[i][0]
            })">Add Picture</button>
                            <button id="${data[i][0]}-${
              i + 2
            }" type="button" class="btn btn-secondary btn-sm buttonDesign" onClick="deleteAlbum(${
                data[i][0]
            })">Delete Album</button></td></div></tr>`;
    }
    albumList += ` </tbody></table>
          <div id="createAlbum">
          <button id="createAlbumBtm"" <button type=" button" class="btn btn-secondary btn-lg buttonDesignCReate" data-toggle="modal" data-target="#albumModalPreview" onClick="createAlbum()">CreateAlbum</button></div>`;
    $("#albumListSec").replaceWith(
        `<div id="AlbumsDataList">${albumList}</div>`
    );

}







onLoad = function() {
    createTableWithAlbums();
};

$("document").ready(onLoad);