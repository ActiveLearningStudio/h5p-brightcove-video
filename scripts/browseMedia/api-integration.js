if (typeof H5PEditor !== 'undefined') {
  H5PEditor.widgets.interactiveVideo = H5PEditor.BrightcoveInteractiveVideo = (function (
    $
  ) {
    setTimeout(() => {
      var wrapper = $("body .h5peditor")
        .children()
        .find(".content")
        .children(".field-name-brightcoveVideoID")
        .children(".h5peditor-text");
      var playlistButton =
        '<div class="h5p-playlist-button-wrapper">' +
        '<button class="loadPlaylist">Browse Videos</button></div>';
      wrapper.after(playlistButton);

      var playlistModalWraper =
        '<div id="playlistContent" class="modal">' +
        '<div class="modal-content">' +
        '<span class="close">&times;</span>' +
        '<div class="tabset">' +
        '<input type="radio" name="tabset" id="brightcove" aria-controls="brightcovePlaylist" checked>' +
        '<label for="brightcove"></label>' +        
        '<section id="brightcovePlaylist" class="tab-panel">' +
        '<div class="search-playlist">' +
        '<label>Search By:</label>'+
        '<select name="brightcoveFilter" id="brightcoveFilter">'+
        '<option value="name">Name</option>'+
        '<option value="id">Video Id</option>'+
        '</select>'+
        '<input type="text" placeholder="search" data-search id="input-playlist" />' +
        "</div>" +
        '<div id="loaderDiv" class=""><div id="modalContent" class="play-lists"></div></div>' +
        "<nav>" +
        '<ul class="pagination justify-content-center pagination-sm brightcove-pagination" id="page_navigation"></ul>' +
        "</nav>" +
        "</section>" +        
        "</div>" +
        "</div>" +
        "</div>";
      $('.field-name-brightcoveVideoID').before(playlistModalWraper);
       
      $(".loadPlaylist").click(function () {
        $('#input-playlist').val('')
        var modal = document.getElementById("playlistContent");
        modal.style.display = "block";
        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
          modal.style.display = "none";
        };
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
          if (event.target == modal) {
            modal.style.display = "none";
          }
        };        

        getBrightcoveList();

        $(document).on("keyup", "#input-playlist", function () {
          var filterVal = $('#brightcoveFilter :selected').val()
          var searchText = $(this).val();
          getBrightcoveList(filterVal, searchText);
        });       

        async function getBrightcoveList(filterVal = '', searchText = '') {
          $('#loaderDiv').attr('class', 'loader');
          var searchQuery;
          if(filterVal == 'id' && searchText && searchText.length > 1){
            searchQuery = 'id='+searchText;
          }else if(filterVal == 'name' && searchText && searchText.length > 1){
            searchQuery = 'name='+searchText;
          }
          console.log('searchQuery:',searchQuery);
          $.ajax({
            type: "POST",
            dataType: "json",
            data:{
              grant_type: BrightcoveAPISetting.grantType,
              client_id: BrightcoveAPISetting.clientId,
              client_secret: BrightcoveAPISetting.clientSecret
            },
            url: BrightcoveAPISetting.apiPath.getToken,
            success: function (data) {
              if(data.access_token){
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    data: {
                      query: searchQuery
                    },
                    headers: {
                      "Authorization": "Bearer "+data.access_token 
                  },
                    url: BrightcoveAPISetting.apiPath.getVideoListAndSearch,
                    success: function (data) {
                      console.log('Su:',data);
                      $('#loaderDiv').attr('class', '');
                      if (data) {
                        document.getElementById("modalContent").innerHTML = "";
                        data.forEach(function (item, index) {
                          var node =
                            '<div class="play-item" data-filter-item data-filter-name="' +
                            item.name.toLowerCase() +
                            '">' +
                            '<img class="play-list-video-bc" src="' +
                            item.images.thumbnail.src +
                            '" width=250 height=250 data-videoid="' +
                            item.id +
                            '">' +
                            '<span class="brightcove-video-title">' +
                            item.name +
                            "</span>" +
                            "</div>";
                          document.getElementById("modalContent").innerHTML += node;
                        });

                        $(document).on("click", ".play-list-video-bc", function () {
                          wrapper.val($(this).data("videoid"));
                          $(".modal").css("display", "none");
                        });
                      } else {
                        console.log(data.error);
                      }
                    },
                });             
                }   
                console.log('TOKEN:',data.access_token);
              },
          });
          
        }

      });
    }, 2000);
  })(H5P.jQuery);
}