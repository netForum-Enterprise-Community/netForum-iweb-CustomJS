window.iWebRoot = location.href.substring(0, location.href.toLowerCase().indexOf("iweb") + 5);

var PageInfo = {
    TopWindow: (window.frameElement == null),
    Page: location.href.substring(location.href.lastIndexOf('/', location.href.indexOf('.aspx')) + 1,  location.href.indexOf('.aspx') + 5),
    FormKey: location.href.substring(location.href.toLowerCase().indexOf('formkey=') + 8, location.href.toLowerCase().indexOf('formkey=') + 44)
}

var PACCustom = {
    Styles: {
        Elements: {
            mainbg: {name: 'Main Background', selector: 'body#BodyTag, body#BodyTag table', rules: ['background-color']},
            textcolor: {name: 'Text Color', selector: 'body#BodyTag, .mltDetail .tinyTXTWhite, .CRMCalDate, .CRMCalDay, .ProfileBODY, .ProfileTXT, .ProfiletinyTXT, #SessionDialogExp, .stagesDiv ul li a:hover', rules: ['color']},
            fontweight: {name: 'Font Weight', selector: 'BODY, p, table, textarea, .fixed-form pre, .fixed-form code, fixed-form.label, button, input, select, .DataFormDropDownList', rules: ['font-weight', 'letter-spacing']},
            fontsize: {name: 'Font Size', selector: 'BODY, p, table, textarea, .fixed-form pre, .fixed-form code, fixed-form.label, button, input, select, .DataFormDropDownList', rules: ['font-size']},
            profilefontsize: {name: 'Font Size', selector: '.ProfileBODY, .ProfileTXTLight', rules: ['font-size']},
            sidebg: {name: 'Sidebar Background', selector: '.sidebar-nav ul', rules: ['background-color']},
            sidetext: {name: 'Sidebar Text', selector: '.sidebar-nav ul a', rules: ['color']},
            childheaderbg: {name: 'Child Form Header Background', selector: '.DataFormChildTABLE .module-header', 'rules': ['background-color']},
            childheadertext: {name: 'Child Form Header Text Color', selector: '.DataFormChildTABLE .module-header', 'rules': ['color']}
        },
        Presets: 
        {
            'blacktext':
            {
                description: "Black text on white backgrounds",
                order: 99,
                rules: {
                    mainbg: {background_color: '#FFF'},
                    textcolor: {color: '#000'},
                    sidetext: {color: '#000'},
                    childheaderbg: {background_color: '#FFF'}
                }
            },
            'boldtext':
            {
                description: "Bold most text",
                order: 99,
                rules: {
                    fontweight: {font_weight: '600', letter_spacing: '.1px'}
                }
            },
            'ninepointtext':
            {
                description: "Increase text size",
                order: 99,
                rules: {
                    fontsize: {font_size: '9pt'},
                    profilefontsize: {font_size: '1em'}
                }
            },
            'whiteondark':
            {
                description: "White text on dark background",
                order: 99,
                rules: {
                    mainbg: {background_color: '#2b2b2b'},
                    textcolor: {color: '#FFF'},
                    sidebg: {background_color: '#2b2b2b'},
                    sidetext: {color: '#FFF'},
                    childheaderbg: {background_color: '#000'}
                },
                rawcss: `aside.sidebar {background-color: #2b2b2b;}
                .form-button-style-3 {color: #007b8b;}
                .ProfileTitleContainer {color: #000;}
                .ProfileTitleLight, .ProfileTitleLight {background-color: #2b2b2b;}
                #header-actions li ul.open-menu {background-color: #2b2b2b;}
                table.DataFormChildTABLE table.table tr:hover {color: #000;}
                div#div1 {background-color: #2b2b2b;}
                #breadcrumb-container {background-color: #2b2b2b;}
                #breadcrumb {background-color: #919191; color: #FFF;}
                .breadcrumb>.active {color: #FFF;}
                #breadcrumb li {text-shadow: none !important;}
                input, select, textarea {background-color: #6b6b6b !important;}`
            }
        },
        Apply: function() {
            $('#PACStyle').remove();

            PACCustom.Styles.Settings = JSON.parse(localStorage.getItem("PACCustom.Styles.Settings"));
            
            //Add the style element to the DOM
            var styleEl = document.createElement("style");
            styleEl.id = "PACStyle";
            styleEl.appendChild(document.createTextNode(""));
            document.body.appendChild(styleEl);
            PACCustom.Styles.Sheet = styleEl.sheet;
        
            for(var presetName in PACCustom.Styles.Presets) {
                if(PACCustom.Styles.Settings[presetName] !== true) continue;
                var objPreset = PACCustom.Styles.Presets[presetName];
                for(var element in objPreset.rules) {
                    var rule = objPreset.rules[element];
                    if(PACCustom.Styles.Elements[element] == null) {
                        PACCustom.Log("PACStyles unable to find rule for " + element);
                    }
                    var cssRule = PACCustom.Styles.Elements[element].selector + " {";
                    for(var style in rule) {
                        cssRule += style.replace("_", "-") + ": " + rule[style] + ";";
                    }
                    cssRule += "}"
                    PACCustom.Styles.Sheet.insertRule(cssRule, 0); 
                }
                if(objPreset.rawcss != null) {
                    var rawRules = objPreset.rawcss.split("\n");
                    for(var rule in rawRules) {
                        PACCustom.Styles.Sheet.insertRule(rawRules[rule]);
                    }
                }
            }

            for(var presetName in PACCustom.Styles.Presets) {
                $('input#PACStyle-' + presetName).prop("checked", PACCustom.Styles.Settings[presetName]);
            }
        },
        Save: function() {
            localStorage.setItem("PACCustom.Styles.Settings", JSON.stringify(PACCustom.Styles.Settings));
        },
        Init: function(){
            $('input[id^=PACStyle]').click(function(){
                var preset = this.id.substring(9);
                var active = $(this).prop('checked');
                PACCustom.Log("Set style " + preset + ' to ' + active);
                PACCustom.Styles.Settings[preset] = active;
                PACCustom.Styles.Save();
                PACCustom.Styles.Apply();
            });

            if(localStorage.getItem("PACCustom.Styles.Settings") == null)
            {
                PACCustom.Log("No saved styles found - setting defaults");
                PACCustom.Styles.Settings = {};
                for(var presetName in PACCustom.Styles.Presets) {
                    PACCustom.Styles.Settings[presetName] = false;
                }
                PACCustom.Styles.Save();
            }

            PACCustom.Styles.Apply();
        }
    },
    FormSpecificElements: {
        Init: function() {
            //Use this to inject elements or fix things on specific forms/pages. PAC uses it to add links to state license verification pages, and some buttons to auto-select dropdowns based on member data
            PACCustom.Log("FormSpecificElements on " + PageInfo.FormKey);
            switch(PageInfo.FormKey) {
            }

            switch(PageInfo.Page) {
                case 'ReportParameters.aspx':
                    //Select boxes on ReportParameters cut off wide options. Make them not.
                    $('select').css('width', 'auto');
                break;
            }
        }
    },
    Log: function(logText) {
        console.log("PACCustom:: " + logText);
    },
    //IDSearch requires a custom MVC controller to search customers and return JSON with cst_key: {cst_key:{<cst data>}}
    IDSearch: {
        RunSearch: function(e){
            if(e.keyCode == 13 && $('#PACCustom-IDSearch').val().length > 5) {
                var searchData = {search_cst_recno: $('#PACCustom-IDSearch').val()};
                var searchType = $('#PACCustom-IDSearchInd').prop('checked') ? 'Individual' : 'Organization';
                $.ajax({
                    type: "GET",
                    url: window.iWebRoot + "forms/PACFindCustomer/RunSearch/" + searchType + "?params=" + JSON.stringify(searchData),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        if (typeof data.error != "undefined") {
                            console.log(data);
                            return;
                        }
                        if (Object.keys(data).length == 1) {
                            var searchType = $('#PACCustom-IDSearchInd').prop('checked') ? 'Individual' : 'Organization';
                            var formKey = (searchType == "Individual" ? "B772881D-D704-40F3-92B6-09B13A50FCC9" : "f326228c-3c49-4531-b80d-d59600485557");
                            location.href = window.iWebRoot + 'forms/DynamicProfile.aspx?FormKey=' + formKey + '&Key=' + Object.keys(data) + '&tab=CRM&tabitem=' + searchType + 's';
                        }
                    },
                    error: function () {
                        alert('An error occurred while running your search. Please try again.');
                    }
                });
            }
        },
        Init: function() {
            var searchDiv = `<div style="width:8em; float:right; margin-left: 1em;">
                <input type="text" id="PACCustom-IDSearch" placeholder="ID Search" style="width: 8em; margin: .7em 0 .3em 0;" />
                <input type="radio" id="PACCustom-IDSearchInd" name="PACCustom-IDSearchFor" checked /><label style="color: #FFF;" for="PACCustom-IDSearchInd">Ind</label>
                <input type="radio" id="PACCustom-IDSearchOrg" name="PACCustom-IDSearchFor" /><label style="color: #FFF;" for="PACCustom-IDSearchOrg">Org</label>
                </div>`;
            $('#header-actions').append(searchDiv);
            $('body').keypress(function(e){if(e.ctrlKey && e.shiftKey && e.keyCode==6)$('#PACCustom-IDSearch').focus().select();});
            $('#PACCustom-IDSearch').on('keydown', PACCustom.IDSearch.RunSearch);
            $('input[name="PACCustom-IDSearchFor"]').on('keydown', PACCustom.IDSearch.RunSearch);
        }
    },
    QuickLinks: {
        Init: function() {
            //Find the 'My Profile' link and steal it's href to use
            var el = $('<li data-toggle="tooltip" data-placement="bottom" data-original-title="User Home"><span class="fa-stack fa-lg"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-home fa-stack-1x fa-inverse"></i></span></li>');
            el.tooltip().click(function(){location.href = $('a:contains(My Profile)').attr('href');});
            $('#header-actions').append(el);
            
            var el = $('<li data-toggle="tooltip" data-placement="bottom" data-original-title="Find Organization"><span class="fa-stack fa-lg"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-university fa-stack-1x fa-inverse"></i></span></li>');
            el.tooltip().click(function(){location.href = window.iWebRoot + "forms/PACFindCustomer/SearchOrganization";});
            $('#header-actions').append(el);
            
            var el = $('<li data-toggle="tooltip" data-placement="bottom" data-original-title="Find Individual"><span class="fa-stack fa-lg"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-child fa-stack-1x fa-inverse"></i></span></li>');
            el.tooltip().click(function(){location.href = window.iWebRoot + "forms/PACFindCustomer/SearchIndividual";});
            $('#header-actions').append(el);
        }
    },
    Init: function() {
        PACCustom.Log("Initializing, top window is " + PageInfo.TopWindow);
        //Add edit icon to header
        $('#header-actions').append('<li id="header-PACCustom" data-toggle="tooltip" data-placement="bottom" data-original-title="PAC Customizations"><span class="fa-stack fa-lg"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-pencil-square fa-stack-1x fa-inverse"></i></span></li>');
        var customSettingsPane = `<ul id="PACCustomSettings" style="display:none;">
        <li><div class="list-header"><div class="row"><div class="col-md-12"><h5>Readability/Colors</h5></div></div></div></li>`;
        for(var presetName in PACCustom.Styles.Presets) {
            var preset = PACCustom.Styles.Presets[presetName];
            customSettingsPane += '<li><span class="list-item-data"><input type="checkbox" id="PACStyle-' + presetName + '" /><label for="PACStyle-' + presetName + '">' + preset.description + '</label></span></li>';
        }
        customSettingsPane += `<li><div class="list-header"><div class="row"><div class="col-md-12"><h5>Tools</h5></div></div></div></li>`;
        customSettingsPane += `<li><span class="list-item-data"><input type="checkbox" id="PACCustom-alohanotebuttons" /><label for="PACCustom-alohanotebuttons">Show Aloha Note Buttons</label></span></li>`
        customSettingsPane += `<li><span class="list-item-data"><a href="#" id="PACResetChildForms">Fix Child Forms not opening</a></span></li>
        </ul>`;
        
        $('#header-PACCustom').append(customSettingsPane);
        $('#header-PACCustom').tooltip();
        for(var component in PACCustom) {
            if(typeof(PACCustom[component].Init) == "function") PACCustom[component].Init();
        }

        //Event handlers for settings items
        $('#PACResetChildForms').click(function(){if(confirm("This will reset all child forms; only use it if your child forms will not open. Continue?")){document.cookie = "netForumChildForm=;Path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT;";location.reload();}});
        
        //Non-LIVE alert
        var href = location.href.toLowerCase();
        if(href.indexOf("nfpactest") > 0 || href.indexOf("nfpacdev") > 0 || href.indexOf(".local") > 0) 
        {
            if(window.frameElement == null) {
                $('div#header div.col-md-8').prepend('<div style="float:left;font-size:3.5em;font-weight: bold;font-variant: small-caps;color: red;">Non-LIVE environment</div>');
            } else {
                window.top.$('#' + window.frameElement.id).parent().prev().find('span').css("color", "red");
                window.top.$('#' + window.frameElement.id).parent().prev().parent().css("box-shadow", "0 0 6px red");
            }
        }

        //Double-click to set current date
        $('input.DatePicker').dblclick(function(){var d = new Date();$(this).val((d.getMonth() + 1)+'/'+d.getDate()+'/'+d.getFullYear()).css('background-color', '#fff38e');});
    }
}


$( document ).ready(function() {
    if(location.href.toLowerCase().indexOf('eweb') != -1) 
    {
        console.log("Eweb detected - bailing out");
        return;
    }
    if (typeof(Storage) == "undefined") {
        console.log("PACCustom requires LocalStorage support. Exiting");
    }
    PACCustom.Init();
});
