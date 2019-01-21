let favourites = [];

$(window).load(function() {
    handleFavourites();
});

$(document).ready(function() {

    //regular button search
    $("#searchButton").click(function() {
        search();
    });

    //searching when 'Enter' key pressed
    $("#searchField").keypress(function(e) {
        let key = e.which;
        if (key === 13) {
            search();
        }
    })  //clear results table once search bar is emptied
        .on("keyup", function(){
        if ($(this).val().length === 0) {
            $('#resultTable').find("tr:gt(0)").remove();
        }
    });

    //Toggles favourite star(green or grey)
    //  facilitates adding/removing to favourites array
    $("body").on("click", "span", function() {
        $( this ).toggleClass( "checked" );
        let title = $(this).siblings().html();
        let body = $(this).parent().siblings().html();
        if ($(this).hasClass("checked")) {
            addFavourite(title, body);
        }
        else {
            removeFavourite(title);
        }
    });
});

//handles loading of Favourites section
function handleFavourites() {
    $('#favouriteTable').find("tr:gt(0)").remove();
    if (favourites.length > 0) {
        for (let i = 0; i < favourites.length; i++) {
            fillTable(favourites[i].title, favourites[i].body, "favouriteTable")
        }
        $('#favouritesWrap').show();
    } else {
        $('#favouritesWrap').hide();
    }
}

//pushes new object to favourites array
function addFavourite( newTitle, newBody) {
    let newFavourite = {"title": newTitle, "body": newBody};
    favourites.push(newFavourite);
    //to re-render the favourites
    handleFavourites();
}

//splices an existing object from favourites array
function removeFavourite(title) {
    for (let i = 0; i < favourites.length; i++) {
        if (favourites[i].title === title) {
            favourites.splice(i);
        }
    }
    //to re-render the favourites
    handleFavourites();
}

//retrieves info from Toronto site
function search() {
    let searchString = $("#searchField").val();
    let url = "https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?";

    $.get( url, function(result) {
        //remove all rows in table (clears table)
        $('#resultTable').find("tr:gt(0)").remove();
        for (let i = 0; i < result.length; i++) {
            if (result[i].keywords.includes(searchString)) {
                let decodedBody = $('<div />').html(result[i].body).text();
                let decodedTitle = $('<div />').html(result[i].title).text();
                fillTable(decodedTitle, decodedBody, "resultTable");
            }
        }
    })
        .fail(function() {
            console.log( "error receiving from api" );
        });

}

//appends new elements in a table
// title and body are in html
//  table specifies which table is being appended to
function fillTable(title, body, table) {
    //'decodes' unicode into html elements
    // let decodedBody = $('<div />').html(body).text();
    // let decodedTitle = $('<div />').html(title).text();

    //appends to last row in specified table
    $('#' + table + ' tr:last').after("<tr><td><span id='favStar' class='fa fa-star'></span><span class='resultTitle'>" + title + "</span></td> <td class='resultBody'>" + body + "</td></tr>");

    //checks if the title is found in favourites
    //  to make the star green
    if (favourites.some(e => e.title === title)) {
        $('#' + table + ' tr:last').children().children('#favStar').toggleClass( "checked" );
    }
}
