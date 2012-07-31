/**
 * Created with PyCharm.
 * User: chb
 * Date: 7/4/12
 * Time: 8:47 AM
 * To change this template use File | Settings | File Templates.
 */

var overlays = {};

//create the close icon
var $closeCircle = $("<img/>");
$closeCircle.attr("class", "close_svg");
$closeCircle.attr("alt", "click here to close");
$closeCircle.attr("src", "images/png/trans.png");
$closeCircle.attr("width", "46px");
$closeCircle.attr("height", "46px");

scrambled_email = "arjzna.yrfyrl@tznvy.pbz";

$(document).ready(
    function()
    {
        //info_panel_data is gotten from the js file of the same name
        createInfoPanels(info_panel_data);

        /*eat dblcklick to be on safe side
        //note that this is not a trivial problem when some elements still need
        //to trigger a single-click event
        //see: http://stackoverflow.com/a/1067484/148680
        //$(document).on("dblclick", "*", null, function(e){e.preventDefault()});
        */

        /*
        // on ready, do the following:
        // 0. put a hover handler on all button images
        // 1. put click handlers on icons and label svgs; passing in fully-
                formed and category-specific div as event.data
        // 2. make sure the cursor becomes a hand/pointer when the mouse is over the element
        // 3. attach a hover animation
        */
        $(".text_sprite,.lg_sprite").hover(triggerHoverPair);

        $(document).on("click", "img[alt='biographical info']", overlays.bio, onClickInfoPanel);
        $("img[alt='biographical info']").css('cursor','pointer');

        $(document).on("click", "img[alt='work experience']", overlays.work, onClickInfoPanel);
        $("img[alt='work experience']").css('cursor','pointer');

        $(document).on("click", "img[alt='academic accomplishments']", overlays.edu, onClickInfoPanel);
        $("img[alt='academic accomplishments']").css('cursor','pointer');

        $(document).on("click", "a[title='contact Lesley']", scrambled_email, mailToDecode);
        $("img[alt='click here to close']").live("click", removeInfoPanel);

    }
);

function createInfoPanels(info_panel_data)
{
    var $newDiv = null;
    var factArray = null;
    //the following returns ["bio","work","edu"]
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
        var htmlContent = null;
        for (var f in factArray)
        {
           fact = factArray[f];
           $newDiv.html(function(index, oldHtml){
               htmlContent = oldHtml + "<p>" + fact + "</p>";
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

    $page.fadeOut(500, function(){
        $infoPanel.css("display","none");
        $("#wrapper").prepend( $infoPanel );
        $infoPanel.fadeIn(1000, null); }
    );
};

function triggerHoverPair(event)
{
    var altStr = $(this).attr("alt");

    var pair = $("img[alt='" + altStr + "']");
    var $img = null;
    var pattern = new RegExp("^(\\w{3,4})(_\\w{2,4})(_sprite)(_hover)?$", "g");
    var $imgClasses = null;
    for (var i=0; i<pair.length; i++)
    {
        $img = $(pair[i]);
        $imgClasses = $img.attr("class").split(" ");
        var newClass = null;
        var result = null;
        for (var n=0; n<$imgClasses.length; n++)
        {
            result = pattern.exec($imgClasses[n]);
            if(result)
            {
                newClass = result[1] + result[2] + result[3];
                //check array length, then check for undef and/or null in 5th elem
                if( result.input.length - result.input.lastIndexOf("_sprite") === "_sprite".length)
                {
                    newClass += "_hover";
                }
            }
        }
        $img.toggleClass(result.input);
        $img.toggleClass(newClass);
    }
}

function mailToDecode(event)
{
    var obfuscAddress = event.data;
    var realEmailAddress = "";

    var emailArr = obfuscAddress.split(/[.@]/);
    console.log(emailArr.length);

    for (var i=0; i < emailArr.length; i++)
    {
        var emailPart = emailArr[i];

        var newCharArr = new Array( emailPart.length );
        var startCharVal = 0;

        for (var n=0;n<emailPart.length;n++)
        {
            //reverse each character
            startCharVal = emailPart.charCodeAt(n);
            if( startCharVal > 96 && startCharVal < 110 )
            {
                newCharArr[n] = String.fromCharCode(startCharVal + 13)
            }
            else if ( startCharVal > 109 && startCharVal < 123 )
            {
                newCharArr[n] = String.fromCharCode(startCharVal - 13)
            }
        }
        realEmailAddress += newCharArr.join("");

        if( i % 2 === 0)
        {
            realEmailAddress += ".";
        }
        else if (i === 1)
        {
            realEmailAddress += "@";
        }

    };

    this.href = "mailto:" + realEmailAddress;
    this.trigger("click");
};

