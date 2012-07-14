/**
 * Created with PyCharm.
 * User: chb
 * Date: 7/4/12
 * Time: 8:47 AM
 * To change this template use File | Settings | File Templates.
 */

var overlays = {};
//var $closeCircle = null;

//create the close icon
var $closeCircle = $("<img/>");
$closeCircle.attr("class", "close_svg");
$closeCircle.attr("alt", "click here to close");
$closeCircle.attr("src", "/images/svg/close_circle.svg");
$closeCircle.attr("width", "43px");
$closeCircle.attr("height", "43px");

$(document).ready(
    function()
    {
        //info_panel_data is gotten from the js file of the same name
        createDivOverlays(info_panel_data);

        /*on ready, put click handlers on icons and label svgs;
          pass in fully-formed and category-specific div as event.data
        */
        $(document).on("click", "img[alt='biographical info']", overlays.bio, onClickInfoPanel);
        $(document).on("click", "img[alt='work experience']", overlays.work, onClickInfoPanel);
        $(document).on("click", "img[alt='academic accomplishments']", overlays.edu, onClickInfoPanel);
        $(document).on("click", "img[alt='contact Lesley']", overlays.form, onClickInfoPanel);
        $("img[alt='click here to close']").live("click", removeInfoPanel);

    }
);

function createDivOverlays(info_panel_data)
{
    var $newDiv = null;
    var factArray = null;
    //returns ["bio","work","edu"]
    var keys = Object.keys(info_panel_data);

    var keyName = null;
    for (var k in keys)
    {
        //get string for index
        keyName = keys[k];
        $newDiv = $("<div/>");
        $newDiv.attr("id", keyName + "_info_panel");
        $newDiv.attr("class", "info_panel");
        factArray = Object.getOwnPropertyDescriptor(info_panel_data, keyName).value;
        var fact = null;
        for (var f in factArray)
        {
           fact = factArray[f];
           $newDiv.html(function(index, oldHtml){
               var htmlContent = oldHtml + "<p>" + fact + "</p>";
               return htmlContent;
           });
        }
        //put the close icon in the new div
        $newDiv.prepend($closeCircle.clone());
        //put the new div in the wrapping map/object
        Object.defineProperty(overlays, keyName, { value: $newDiv, writeable: true});
    }

    //create the contact form and put it in the div map
    //$contactForm = constructContactForm();

}

/*function constructContactForm()
{
    var $newDiv = $("<div/>");
    $newDiv.attr("id", "contact_form");
    $newDiv.attr("class", "info_panel");

    //now build the form
    var $jqForm = $("<form />");
    var $emailField = $('<input type="text" maxlength="256"/>');
    var $subjectField = $('<input type="text" maxlength="128"/>');
    var $bodyField = $('<input type="textarea" maxlength="1024"/>');
    $jqForm.append($emailField);
    $jqForm.append($subjectField);
    $jqForm.append($bodyField);

    $newDiv.append($closeCircle.clone());
    $newDiv.append($jqForm);

    var keyName = "form";
    Object.defineProperty(overlays, keyName, {value: $newDiv, writeable: true});
}*/

function removeInfoPanel(event)
{
    var $panel = $(".info_panel");
    $panel.remove();
    var $page = $("#page");
    $page.show();
}

function onClickInfoPanel( event )
{
    var $infoPanel = event.data;
    var $page = $("div#page");

    $page.hide(0, function(){
        $("#wrapper").prepend( $infoPanel );
        $infoPanel.fadeIn(); }
    );
};

/*function decodeEmail(str)
{
    return str.replace(/[a-zA-Z]/g, function(c){
            return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
        });
}*/

function decodeEmail(str)
{
    return str.replace(/[a-zA-Z]/g, function(c)
    {
        //return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
        return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
    });
}

