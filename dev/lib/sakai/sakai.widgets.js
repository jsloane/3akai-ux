/*
 * Licensed to the Sakai Foundation (SF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The SF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 */

/*
 * Dependencies
 *
 */



require(["jquery", "sakai/sakai.api.core"], function($, sakai) {
    
    
    
// MISSING CONTENTAUTHORING - widget won't work if included - suspect sakai.api issues

    sakai_global.footer = function(tuid,showSettings){


        /////////////////////////////
        // Configuration variables //
        /////////////////////////////

        var doc_name;
        var $back_to_top_link = $(".footer_main .back-top");
        var $footer_debug_info = $("#footer_debug_info");
        var $footer_date_end = $("#footer_date_end");
        var $footer_root = $(".footer_main");
        var $footer_logo = $("#footer_logo_button");
        var $footer_www = $("#footer_www");
        var $footer_divider = $("#footer_divider");
        var $footer_phone = $("#footer_phone");
        var $footer_contactinfo = $("#footer_contactinfo");
        var $footer_contactinfo_template = $("#footer_contactinfo_template");
        var $footer_links_left = $("#footer_links");
        var $footer_links_left_template = $("#footer_links_template");
        var $footer_links_right = $("#footer_links_right");
        var $footer_links_right_template = $("#footer_links_right_template");
        var $footer_langloc_buttons = $('p.footer_langloc>button');


        //////////////////////
        // Helper functions //
        //////////////////////

        /**
         * This helper function will return the name of the current document (e.g. my_sakai.html)
         * @return {String} The name of the current document
         */
        var getDocName = function() {
            var url = document.URL;
            var slash = "/";
            if (url.match(/\\/)) {
                slash = "\\";
            }
            return decodeURIComponent(url.substring(url.lastIndexOf(slash) + 1));
        };

        ////////////////////
        // Main functions //
        ////////////////////

        /**
         * Render the debug info
         * @param {Object} container jQuery selector where you want the debug info to appear in
         */
        var renderDebugInfo = function(container) {

            $.ajax({
                url: "/var/scm-version.json",
                type: "GET",
                cache: false,
                dataType: "json",
                success: function(data){
                    // Construct debug info
                    var debug_text = "DEBUG:";
                    debug_text += " Nakamura Version: " + data["sakai:nakamura-version"];
                    getUxVersion(debug_text, container);
                }
            });
        };

        var getUxVersion = function(debug_text, container) {
            $.ajax({
                url: "/var/ux-version/ux-version.json",
                type: "GET",
                cache: false,
                dataType: "json",
                success: function(data){
                    debug_text += " | UX Version: " + data["sakai:ux-version"];
                    debug_text += "<br/>DOC mod date: " + document.lastModified;
                    debug_text += " | PLACE: " + (doc_name || "index.html");

                    // Put text into holding tag
                    container.html(sakai.api.Security.saneHTML(debug_text));
                }
            });
        };

        var updateLocationLanguage = function(){
            if (!sakai.data.me.user.anon) {
                $("#footer_location").text(sakai.data.me.user.locale.timezone.name);
                for (var i = 0, len = sakai.config.Languages.length; i < len; i++) {
                    if (sakai.data.me.user.locale.country === sakai.config.Languages[i].country) {
                        $("#footer_language").text(sakai.config.Languages[i].displayName);
                        break;
                    }
                }
            }
        };

        /**
         * This event handler will make sure that the Top link
         * that's available in every page footer will scroll back
         * to the top of the page
         */
        $(".back-top").live("click", function(ev){
            window.scrollTo(0,0);
        });


        /////////////////////////////
        // Initialisation function //
        /////////////////////////////

        /**
         * Main initialization function for the footer widget
         */
        var doInit = function(){

            // Get the name of the current document
            doc_name = getDocName();

            // Display debug info if set in config
            if (sakai.config.displayDebugInfo === true) {

                // Add binding to the image
                $footer_logo.toggle(function(){

                    // Render the debug info
                    renderDebugInfo($footer_debug_info);

                    // Show the debug info
                    $footer_debug_info.show();

                },function(){

                    // Hide the debug info
                    $footer_debug_info.hide();

                }).addClass("footer_clickable");

            }
            
            if (!sakai.data.me.user.anon && (sakai.config.displayTimezone || sakai.config.displayLanguage)) {
                if (sakai.config.displayTimezone) {
                    $("#footer_langdoc_loc").show();
                }
                if (sakai.config.displayLanguage) {
                    $("#footer_langdoc_lang").show();
                }
            }

            // Set the end year of the copyright notice
            var d = new Date();
            $footer_date_end.text(d.getFullYear());

            var leftLinksHTML = sakai.api.Util.TemplateRenderer($footer_links_left_template, {links:sakai.config.Footer.leftLinks});
            leftLinksHTML = sakai.api.i18n.General.process(leftLinksHTML, "footer");
            $footer_links_left.html(leftLinksHTML);

            var rightLinksHTML = sakai.api.Util.TemplateRenderer($footer_links_right_template, {links:sakai.config.Footer.rightLinks});
            rightLinksHTML = sakai.api.i18n.General.process(rightLinksHTML, "footer");
            $footer_links_right.html(rightLinksHTML);

            $footer_langloc_buttons.click(function(e){
                e.preventDefault();
                $(window).trigger("init.accountpreferences.sakai");
            });

            updateLocationLanguage();
        };

        doInit();

    };
    

    sakai_global.topnavigation = function(tuid, showSettings){


        ///////////////////
        // CONFIGURATION //
        ///////////////////

        var qs = new Querystring();

        // Elements
        var subnavtl = ".hassubnav_tl";
        var navLinkDropdown = ".s3d-dropdown-container";
        var hasSubnav = ".hassubnav";
        var topnavExplore = ".topnavigation_explore";
        var topnavExploreLeft = '#topnavigation_explore_left';
        var topnavExploreRight = '#topnavigation_explore_right';
        var topnavUserOptions = ".topnavigation_user_options";
        var topnavUserDropdown = ".topnavigation_user_dropdown";
        var topnavigationlogin = "#topnavigation_user_options_login_wrapper";
        var topnavigationExternalLogin= ".topnavigation_external_login";
        var topnavUserLoginButton = "#topnavigation_user_options_login";

        // Form
        var topnavUserOptionsLoginForm = "#topnavigation_user_options_login_form";
        var topnavUseroptionsLoginFieldsUsername = "#topnavigation_user_options_login_fields_username";
        var topnavUseroptionsLoginFieldsPassword = "#topnavigation_user_options_login_fields_password";
        var topnavuserOptionsLoginButtonLogin = "#topnavigation_user_options_login_button_login";
        var topnavUserOptionsLoginButtonSigningIn = "#topnavigation_user_options_login_button_signing_in";
        var topnavUserOptionsLoginButtonCancel = "#topnavigation_user_options_login_button_cancel";

        // Containers
        var topnavSearchResultsContainer = "#topnavigation_search_results_container";
        var topnavSearchResultsBottomContainer = "#topnavigation_search_results_bottom_container";
        var topnavUserInboxMessages = "#topnavigation_user_inbox_messages";
        var topnavUserOptionsName = "#topnavigation_user_options_name";
        var topnavUserContainer = ".topnavigation_user_container";
        var topnavUserOptionsLoginFields = "#topnavigation_user_options_login_fields";
        var topnavUserOptionsLoginError = "#topnavigation_user_options_login_error";

        // Classes
        var topnavigationForceSubmenuDisplay = "topnavigation_force_submenu_display";
        var topnavigationForceSubmenuDisplayTitle = "topnavigation_force_submenu_display_title";

        // Templates
        var navTemplate = "navigation_template";
        var searchTemplate = "search_template";
        var searchBottomTemplate = "search_bottom_template";
        var topnavUserTemplate = "topnavigation_user_template";

        var renderObj = {
            "people":"",
            "groups":"",
            "files":"",
            "peopletotal":0,
            "groupstotal":0,
            "filestotal":0
        };

        var lastSearchVal = "",
            searchTimeout = false;

        var $openMenu = false;
        var $openPopover = false;


        ////////////////////////
        ///// USER ACTIONS /////
        ////////////////////////

        /**
         * Fill in the user name
         */
        var setUserName = function(){
            $(topnavUserOptionsName).html(sakai.api.Util.applyThreeDots(sakai.api.User.getDisplayName(sakai.data.me.profile), 100, null, null, true));
        };

        /**
         * Show the logout element
         */
        var showLogout = function(){
            if ($(topnavUserDropdown).is(":visible")) {
                $(topnavUserDropdown).hide();
            } else {
                $(topnavUserDropdown).show();
                $(topnavUserDropdown).css("display", "inline");
            }
        };

        /**
         * Show the login element
         */
        var showLogin = function(){
            if ($(topnavUserOptionsLoginFields).is(":visible")) {
                $(topnavUserOptionsLoginFields).hide();
            } else {
                $(topnavUserOptionsLoginFields).show();
                $(topnavUseroptionsLoginFieldsUsername).focus();
            }
        };

        /**
         * Decide to show login or logout option
         */
        var decideShowLoginLogout = function(){
            if(sakai.data.me.user.anon){
                showLogin();
            }else{
                showLogout();
            }
        };


        var renderUser = function(){
            var externalAuth = false;
            if (!sakai.config.Authentication.internal && !sakai.config.Authentication.allowInternalAccountCreation) {
                externalAuth = true;
            }
            var auth = {
                "externalAuth": externalAuth,
                "internalAndExternal": sakai.config.Authentication.internalAndExternal,
                "Authentication": sakai.config.Authentication
            };
            $(topnavUserContainer).html(sakai.api.Util.TemplateRenderer(topnavUserTemplate, {
                "anon" : sakai.data.me.user.anon,
                "auth": auth,
                "displayName": sakai.api.User.getDisplayName(sakai.data.me.profile),
                "sakai": sakai
            }));
            if (externalAuth){
                setExternalLoginRedirectURL();
            }
        };

        var setExternalLoginRedirectURL = function(){
            var redirectURL = getRedirectURL();
            $(".topnavigation_external_login_link").each(function(index, item){
                $(item).attr('href', $.param.querystring($(item).attr('href'), {"url": redirectURL}));
            });
        };

        var getRedirectURL = function(){
            var redirectURL = window.location.pathname + window.location.search + window.location.hash;
            // Check whether we require a redirect
            if (qs.get("url")) {
                redirectURL = qs.get("url");
            // Go to You when you're on explore page
            } else if (window.location.pathname === "/dev/explore.html" || window.location.pathname === "/register" ||
                window.location.pathname === "/index" || window.location.pathname === "/" || window.location.pathname === "/dev") {
                redirectURL = "/me";
            // 500 not logged in
            } else if (sakai_global.nopermissions && sakai.data.me.user.anon && sakai_global.nopermissions.error500){
                redirectURL = "/me";
            }
            return redirectURL;
        };

       /**
         * Check if a redirect should be performed
         */
        var checkForRedirect = function() {
            // Check for url param, path and if user is logged in
            if (qs.get("url") && !sakai.api.User.isAnonymous(sakai.data.me) &&
                (window.location.pathname === "/" || window.location.pathname === "/dev/explore.html" ||
                  window.location.pathname === "/index" || window.location.pathname === "/dev")) {
                    window.location = qs.get("url");
            }
        };

        /**
         * Open the login overlay even though the user is not hovering over it and if there is a URL redirect
         */
        var forceShowLoginUrl = function(){
            if (qs.get("url")) {
                forceShowLogin();
            }
        };

        /**
         * Open the login overlay even though the user is not hovering over it
         */
        var forceShowLogin = function(){
            if (sakai.api.User.isAnonymous(sakai.data.me)) {
                $("#topnavigation_user_options_login_fields").addClass("topnavigation_force_submenu_display");
                $("#topnavigation_user_options_login_wrapper").addClass("topnavigation_force_submenu_display_title");
                $("#topnavigation_user_options_login_fields_username").focus();
            }
        };

        ////////////////////////
        /////// MESSAGES ///////
        ////////////////////////

        /**
         * Show the number of unread messages
         */
        var setCountUnreadMessages = function(){
            $(topnavUserInboxMessages).text(sakai.api.User.data.me.messages.unread);
        };

        var renderResults = function(){
            renderObj.sakai = sakai;
            $(topnavSearchResultsContainer).html(sakai.api.Util.TemplateRenderer(searchTemplate, renderObj));
            $(topnavSearchResultsBottomContainer).html(sakai.api.Util.TemplateRenderer(searchBottomTemplate, renderObj));
            $("#topnavigation_search_results").show();
        };

        var renderPeople = function(data) {
            var people = [];
            if (data) {
                for (var i in data.results) {
                    if (data.results.hasOwnProperty(i)) {
                        var displayName = sakai.api.User.getDisplayName(data.results[i]);
                        var dottedName = sakai.api.Util.applyThreeDots(displayName, 100, null, null, true);
                        var tempPerson = {
                            "dottedname": dottedName,
                            "name": sakai.api.User.getDisplayName(data.results[i]),
                            "url": data.results[i].homePath
                        };
                        people.push(tempPerson);
                    }
                }
                renderObj.people = people;
                renderObj.peopletotal = data.total;
                renderResults();
            }
        };

        var renderGroups = function(data, category) {
            var groups = [];
            if (data) {
                for (var i in data.results) {
                    if (data.results.hasOwnProperty(i)) {
                        var tempGroup = {
                            "dottedname": sakai.api.Util.applyThreeDots(data.results[i]["sakai:group-title"], 100),
                            "name": data.results[i]["sakai:group-title"],
                            "url": data.results[i].homePath
                        };
                        if (data.results[i]["sakai:group-visible"] == "members-only" || data.results[i]["sakai:group-visible"] == "logged-in-only") {
                            tempGroup["css_class"] = "topnavigation_group_private_icon";
                        } else {
                            tempGroup["css_class"] = "topnavigation_group_public_icon";
                        }
                        groups.push(tempGroup);
                    }
                }
                renderObj.groups = renderObj.groups ||
                {};
                renderObj.groups[category] = groups;
                renderObj.groups[category + "total"] = data.total;
                renderResults();
            }
        };

        var renderContent = function(data) {
            var files = [];
            if (data) {
                for (var i in data.results) {
                    if (data.results.hasOwnProperty(i)) {
                        var mimeType = sakai.api.Content.getMimeTypeData(sakai.api.Content.getMimeType(data.results[i])).cssClass;
                        var tempFile = {
                            "dottedname": sakai.api.Util.applyThreeDots(data.results[i]["sakai:pooled-content-file-name"], 100),
                            "name": data.results[i]["sakai:pooled-content-file-name"],
                            "url": "/content#p=" + sakai.api.Util.safeURL(data.results[i]["_path"]) + "/" + sakai.api.Util.safeURL(data.results[i]["sakai:pooled-content-file-name"]),
                            "css_class": mimeType
                        };
                        files.push(tempFile);
                    }
                }
                renderObj.files = files;
                renderObj.filestotal = data.total;
                renderResults();
            }
        };


        ////////////////////////
        //////// SEARCH ////////
        ////////////////////////

        /**
         * Execute the live search and render the results
         */
        var doSearch = function(){
            var searchText = $.trim($("#topnavigation_search_input").val());
            var filesUrl = sakai.config.URL.SEARCH_ALL_FILES.replace(".json", ".infinity.json");
            var usersUrl = sakai.config.URL.SEARCH_USERS;
            var groupsUrl = sakai.config.URL.SEARCH_GROUPS;
            if (searchText === "*" || searchText === "**") {
                filesUrl = sakai.config.URL.SEARCH_ALL_FILES_ALL;
                usersUrl = sakai.config.URL.SEARCH_USERS_ALL;
                groupsUrl = sakai.config.URL.SEARCH_GROUPS_ALL;
            }

            renderObj.query = searchText;
            searchText = sakai.api.Server.createSearchString(searchText);
            var requests = [];
            requests.push({
                "url": filesUrl,
                "method": "GET",
                "parameters": {
                    "page": 0,
                    "items": 3,
                    "q": searchText
                }
            });
            requests.push({
                "url": usersUrl,
                "method": "GET",
                "parameters": {
                    "page": 0,
                    "items": 3,
                    "sortOn": "lastName",
                    "sortOrder": "asc",
                    "q": searchText
                }
            });
            for (var c = 0; c < sakai.config.worldTemplates.length; c++){
                var category = sakai.config.worldTemplates[c];
                requests.push({
                    "url": groupsUrl,
                    "method": "GET",
                    "parameters": {
                        "page": 0,
                        "items": 3,
                        "q": searchText,
                        "category": category.id
                    }
                });
            }
            

            sakai.api.Server.batch(requests, function(success, data) {
                renderContent($.parseJSON(data.results[0].body));
                renderPeople($.parseJSON(data.results[1].body));
                for (var c = 0; c < sakai.config.worldTemplates.length; c++) {
                    renderGroups($.parseJSON(data.results[2 + c].body), sakai.config.worldTemplates[c].id);
                }
            });
        };


        ////////////////////////
        ////// NAVIGATION //////
        ////////////////////////

        /**
         * Generate a subnavigation item
         * @param {integer} index Index of the subnavigation item in the array
         * @param {Array} array Array of subnavigation items
         */
        var getNavItem = function(index, array){
            var temp = {};
            var item = array[index];
            temp.id = item.id;
            if (temp.id && temp.id == "subnavigation_hr") {
                temp = "hr";
            } else {
                if (sakai.data.me.user.anon && item.anonUrl) {
                    temp.url = item.anonUrl;
                } else {
                    temp.url = item.url;
                    if(item.append){
                        temp.append = item.append;
                    }
                }
                temp.label = sakai.api.i18n.getValueForKey(item.label);
            }
            return temp;
        };

        /**
         * Create a list item for the topnavigation menu including the subnavigation
         * @param {integer} i index of the current item in the loop
         */
        var createMenuList = function(i){
            var temp = getNavItem(i, sakai.config.Navigation);
            // Add in the template categories
            if (sakai.config.Navigation[i].id === "navigation_create_and_add_link"){
                for (var c = 0; c < sakai.config.worldTemplates.length; c++){
                    var category = sakai.config.worldTemplates[c];
                    sakai.config.Navigation[i].subnav.push({
                        "id": "subnavigation_" + category.id + "_link",
                        "label": category.menuLabel || category.title,
                        "url": "/create#l=" + category.id
                    });
                }
            } else if (sakai.config.Navigation[i].id === "navigation_explore_link" || sakai.config.Navigation[i].id === "navigation_anon_explore_link"){
                for (var x = 0; x < sakai.config.worldTemplates.length; x++){
                    var categoryx = sakai.config.worldTemplates[x];
                    sakai.config.Navigation[i].subnav.push({
                        "id": "subnavigation_explore_" + categoryx.id + "_link",
                        "label": categoryx.titlePlural,
                        "url": "/search#l=" + categoryx.id
                    });
                }
            }

            if (sakai.config.Navigation[i].subnav) {
                temp.subnav = [];
                for (var ii in sakai.config.Navigation[i].subnav) {
                    if (sakai.config.Navigation[i].subnav.hasOwnProperty(ii)) {
                        temp.subnav.push(getNavItem(ii, sakai.config.Navigation[i].subnav));
                    }
                }
            }
            return temp;
        };

        /**
         * Initialise the rendering of the topnavigation menu
         */
        var renderMenu = function(){
            var obj = {};
            var leftMenulinks = [];
            var rightMenuLinks = [];

            $('#topnavigation_container .s3d-jump-link').each(function() {
                if ($($(this).attr('href') + ':visible').length) {
                    $(this).show();
                }
            });
            $('#topnavigation_container .s3d-jump-link').on('click', function() {
                $($(this).attr('href')).focus();
                return false;
            });

            for (var i in sakai.config.Navigation) {
                if (sakai.config.Navigation.hasOwnProperty(i)) {
                    var temp = "";
                    /* Check that the user is anon, the nav link is for anon
                     * users, and if the link is the account create link,
                     * that internal account creation is allowed
                     */
                    var anonAndAllowed = sakai.data.me.user.anon &&
                        sakai.config.Navigation[i].anonymous &&
                        (
                            sakai.config.Navigation[i].id !== 'navigation_anon_signup_link' ||
                            (
                                sakai.config.Navigation[i].id === 'navigation_anon_signup_link' &&
                                sakai.config.Authentication.allowInternalAccountCreation
                            )
                        );
                    var isNotAnon = !sakai.data.me.user.anon &&
                        !sakai.config.Navigation[i].anonymous;
                    var shouldPush = anonAndAllowed || isNotAnon;
                    if (shouldPush) {
                        temp = createMenuList(i);
                        if (sakai.config.Navigation[i].rightLink) {
                            rightMenuLinks.push(temp);
                        } else {
                            leftMenulinks.push(temp);
                        }
                    }
                }
            }
            obj.links = leftMenulinks;
            obj.selectedpage = true;
            obj.sakai = sakai;
            // Get navigation and render menu template
            $(topnavExploreLeft).html(sakai.api.Util.TemplateRenderer(navTemplate, obj));

            obj.links = rightMenuLinks;
            $(topnavExploreRight).html(sakai.api.Util.TemplateRenderer(navTemplate, obj));
        };


        /////////////////////////
        ///// BIND ELEMENTS /////
        /////////////////////////

        var handleArrowKeyInSearch = function(up) {
            if ($(topnavSearchResultsContainer).find("li").length) {
                var currentIndex = 0,
                    next = 0;
                if ($(topnavSearchResultsContainer).find("li.selected").length) {
                    currentIndex = $(topnavSearchResultsContainer).find("li").index($(topnavSearchResultsContainer).find("li.selected")[0]);
                    next = up ? (currentIndex - 1 >= 0 ? currentIndex-1 : -1) : (currentIndex + 1 >= $(topnavSearchResultsContainer).find("li").length ? $(topnavSearchResultsContainer).find("li").length-1 : currentIndex +1);
                    $(topnavSearchResultsContainer).find("li.selected").removeClass("selected");
                }
                if (next !== 0 && next === currentIndex){
                    next = 0;
                } else if (next === -1){
                    next = $(topnavSearchResultsContainer).find("li").length - 1;
                }
                if (next !== -1) {
                    $(topnavSearchResultsContainer).find("li:eq(" + next + ")").addClass("selected");
                }
                return false;
            }
        };

        var handleEnterKeyInSearch = function() {
            if ($(topnavSearchResultsContainer).find("li.selected").length) {
                document.location = $(topnavSearchResultsContainer).find("li.selected a").attr("href");
            } else {
                document.location = "/search#q=" + $.trim($("#topnavigation_search_input").val());
                $("#topnavigation_search_results").hide();
            }
        };

        var hideMessageInlay = function(){
            $("#topnavigation_user_messages_container .s3d-dropdown-menu").hide();
            $("#topnavigation_messages_container").removeClass("selected");
        };

        /**
         * Add binding to the elements
         */
        var addBinding = function(){

            sakai.api.Util.hideOnClickOut("#topnavigation_user_messages_container .s3d-dropdown-menu", "", function(){
                hideMessageInlay();
            });

            // Navigation hover binding
            var closeMenu = function(e){
                if ($openMenu.length){
                    $openMenu.children("a").removeClass(topnavigationForceSubmenuDisplayTitle);
                    $openMenu.children(subnavtl).hide();
                    $openMenu.children(navLinkDropdown).children("ul").attr("aria-hidden", "true");
                    $openMenu.children(navLinkDropdown).hide();
                    $openMenu = false;
                }
            };
            // Navigation popover binding
            var closePopover = function(e){
                if ($openPopover.length){
                    $openPopover.prev().removeClass("selected");
                    $openPopover.attr("aria-hidden", "true");
                    $openPopover.hide();
                    $openPopover = false;
                }
            };
            var openMenu = function(){
                $("#topnavigation_search_results").hide();
                if ($("#navigation_anon_signup_link:focus").length){
                    $("#navigation_anon_signup_link:focus").blur();
                }

                // close another sub menu if ones open
                closeMenu();
                closePopover();

                $openMenu = $(this);
                $openMenu.removeClass("topnavigation_close_override");
                $openMenu.children(subnavtl).show();
                $openMenu.children(navLinkDropdown).children("ul").attr("aria-hidden", "false");
                var $subnav = $openMenu.children(navLinkDropdown);

                var pos = $openMenu.position();
                $subnav.css("left", pos.left - 2);
                $subnav.show();

                if ($openMenu.children(topnavigationExternalLogin).length){
                    // adjust margin of external login menu to position correctly according to padding and width of menu
                    var menuPadding = parseInt($openMenu.css("paddingRight").replace("px", ""), 10) +
                         $openMenu.width() -
                         parseInt($subnav.css("paddingRight").replace("px", ""), 10) -
                         parseInt($subnav.css("paddingLeft").replace("px", ""), 10);
                    var margin = ($subnav.width() - menuPadding) * -1;
                    $subnav.css("margin-left", margin + "px");
                }
            };


            var toggleInternalLogin = function() {
                $(topnavUserOptionsLoginForm).toggle();
            };

            $('#topnavigation_container').on(
                'click',
                '#topnavigation_toggle_internal_login',
                toggleInternalLogin);

            $(hasSubnav).hover(openMenu, function(){
                closePopover();
                closeMenu();
            });

            // remove focus of menu item if mouse is used
            $(hasSubnav + " div").find("a").hover(function(){
                if ($openMenu.length) {
                    $openMenu.find("a").blur();
                }
            });

            // bind down/left/right/letter keys for explore menu
            $("#topnavigation_container .topnavigation_explore .s3d-dropdown-menu,.topnavigation_counts_container button").keydown(function(e) {
                var $focusElement = $(this);
                if (e.which === $.ui.keyCode.DOWN && $focusElement.hasClass("hassubnav")) {
                    $focusElement.find("div a:first").focus();
                    return false; // prevent browser page from scrolling down
                } else if (e.which === $.ui.keyCode.LEFT || (e.which === $.ui.keyCode.TAB && e.shiftKey) && $focusElement.attr("id") !== "topnavigation_user_options_login_wrapper") {
                    closeMenu();
                    closePopover();
                    if($focusElement.parents(".topnavigation_counts_container").length){
                        $focusElement = $focusElement.parents(".topnavigation_counts_container");
                    }
                    if($focusElement.prev(".topnavigation_counts_container").length){
                        $focusElement.prev(".topnavigation_counts_container").children("button").focus();
                        return false;
                    } else if ($focusElement.prev("li:first").length){
                        $focusElement.prev("li:first").children("a").focus();
                        return false;
                    } else if (!(e.which === $.ui.keyCode.TAB && e.shiftKey)){
                        $focusElement.nextAll("li:last").children("a").focus();
                        return false;
                    }
                } else if ((e.which === $.ui.keyCode.RIGHT || e.which === $.ui.keyCode.TAB) && $focusElement.attr("id") !== "topnavigation_user_options_login_wrapper") {
                    closeMenu();
                    closePopover();
                    if($focusElement.parents(".topnavigation_counts_container").length){
                        $focusElement = $focusElement.parents(".topnavigation_counts_container");
                    }
                    if($focusElement.next(".topnavigation_counts_container").length){
                        $focusElement.next(".topnavigation_counts_container").children("button").focus();
                    } else if ($focusElement.next("li:first").length){
                        $focusElement.next("li:first").children("a").focus();
                    } else if ($focusElement.prevAll("li:last").length && e.which === $.ui.keyCode.RIGHT){
                        $focusElement.prevAll("li:last").children("a").focus();
                    } else {
                        $("#topnavigation_search_input").focus();
                    }
                    return false;
                } else if ($focusElement.hasClass("hassubnav") && $focusElement.children("a").is(":focus")) {
                    // if a letter was pressed, search for the first menu item that starts with the letter
                    var key = String.fromCharCode(e.which).toLowerCase();
                    $focusElement.find("ul:first").children().each(function(index, item){
                        var firstChar = $.trim($(item).text()).toLowerCase().substr(0, 1);
                        if (key === firstChar){
                            $(item).find("a").focus();
                            return false;
                        }
                    });
                }
            });

            // bind keys for right menu
            $("#topnavigation_container .topnavigation_right .s3d-dropdown-menu").keydown(function(e) {
                var $focusElement = $(this);
                if (e.which === $.ui.keyCode.DOWN && $focusElement.hasClass("hassubnav")) {
                    $focusElement.find("div a:first").focus();
                    return false; // prevent browser page from scrolling down
                } else if (e.which === $.ui.keyCode.TAB && e.shiftKey) {
                    closeMenu();
                } else if ($focusElement.hasClass("hassubnav") && $focusElement.children("a").is(":focus")) {
                    // if a letter was pressed, search for the first menu item that starts with the letterletter
                    var key = String.fromCharCode(e.which).toLowerCase();
                    $focusElement.find("ul:first").children().each(function(index, item){
                        var firstChar = $.trim($(item).text()).toLowerCase().substr(0, 1);
                        if (key === firstChar){
                            $(item).find("a").focus();
                            return false;
                        }
                    });
                }
            });

            $("#topnavigation_user_inbox_container").keydown(function(e) {
                if (e.which == $.ui.keyCode.LEFT) {
                    if ($("#topnavigation_search_input").length) {
                        // focus on search input
                        $("#topnavigation_search_input").focus();
                    }
                } else if (e.which == $.ui.keyCode.RIGHT) {
                    if ($("#topnavigation_user_options_name").length) {
                        // focus on user options menu
                        $("#topnavigation_user_options_name").focus();
                    }
                }
            });

            // bind up/down/escape keys in sub menu
            $(hasSubnav + " div a").keydown(function(e) {
                if (e.which === $.ui.keyCode.DOWN) {
                    if ($(this).parent().nextAll("li:first").length){
                        $(this).parent().nextAll("li:first").children("a").focus();
                    } else {
                        $(this).parent().prevAll("li:last").children("a").focus();
                    }
                    return false; // prevent browser page from scrolling down
                } else if (e.which === $.ui.keyCode.UP) {
                    if ($(this).parent().prevAll("li:first").length) {
                        $(this).parent().prevAll("li:first").children("a").focus();
                    } else {
                        $(this).parent().nextAll("li:last").children("a").focus();
                    }
                    return false;
                } else if (e.which === $.ui.keyCode.ESCAPE) {
                    $(this).parent().parents("li:first").find("a:first").focus();
                } else {
                    // if a letter was pressed, search for the next menu item that starts with the letter
                    var keyPressed = String.fromCharCode(e.which).toLowerCase();
                    var $activeItem = $(this).parents("li:first");
                    var $menuItems = $(this).parents("ul:first").children();
                    var activeIndex = $menuItems.index($activeItem);
                    var itemFound = false;
                    $menuItems.each(function(index, item){
                        var firstChar = $.trim($(item).text()).toLowerCase().substr(0, 1);
                        if (keyPressed === firstChar && index > activeIndex){
                            $(item).find("a").focus();
                            itemFound = true;
                            return false;
                        }
                    });
                    if (!itemFound) {
                        $menuItems.each(function(index, item){
                            var firstChar = $.trim($(item).text()).toLowerCase().substr(0, 1);
                            if (keyPressed === firstChar) {
                                $(item).find("a").focus();
                                return false;
                            }
                        });
                    }
                }
            });

            $(hasSubnav + " a").bind("focus",function(){
                if ($(this).parent().hasClass("hassubnav")) {
                    $(this).trigger("mouseover");
                    $(this).parents(".s3d-dropdown-menu").children("a").addClass(topnavigationForceSubmenuDisplayTitle);
                }
            });

            $("#navigation_anon_signup_link").live("hover",function(evt){
                closeMenu();
                closePopover();
            });

            // hide the menu after an option has been clicked
            $(hasSubnav + " a").live("click", function(){
                var $parentMenu = $(this).parents(hasSubnav);
                var $parent = $(this).parent(hasSubnav);
                if ($parent.length) {
                    $parentMenu.addClass("topnavigation_close_override");
                }
                $parentMenu.children(subnavtl).hide();
                $parentMenu.children(navLinkDropdown).hide();
            });

            // Make sure that the results only disappear when you click outside
            // of the search box and outside of the results box
            sakai.api.Util.hideOnClickOut("#topnavigation_search_results", "#topnavigation_search_results_container,#topnavigation_search_results_bottom_container,#topnavigation_search_input");

            $("#subnavigation_preferences_link").live("click", function(){
                $(window).trigger("init.accountpreferences.sakai");
                return false;
            });

            $("#topnavigation_search_input").keyup(function(evt){
                var val = $.trim($(this).val());
                if (val !== "" && evt.keyCode !== 16 && val !== lastSearchVal) {
                    if (searchTimeout) {
                        clearTimeout(searchTimeout);
                    }
                    searchTimeout = setTimeout(function() {
                        doSearch();
                        lastSearchVal = val;
                    }, 200);
                } else if (val === "") {
                    lastSearchVal = val;
                    $("#topnavigation_search_results").hide();
                }
            });

            $(".topnavigation_search .s3d-search-button").bind("click", handleEnterKeyInSearch);

            $("#topnavigation_search_input").keydown(function(evt){
                var val = $.trim($(this).val());
                // 40 is down, 38 is up, 13 is enter
                if (evt.keyCode === 40 || evt.keyCode === 38) {
                    handleArrowKeyInSearch(evt.keyCode === 38);
                    evt.preventDefault();
                } else if (evt.keyCode === 13) {
                    handleEnterKeyInSearch();
                    evt.preventDefault();
                }
            });

            $(".topnavigation_user_dropdown a, .topnavigation_external_login a").keydown(function(e) {
                // if user is signed in and tabs out of user menu, or the external auth menu, close the sub menu
                if (!e.shiftKey && e.which == $.ui.keyCode.TAB) {
                    closeMenu();
                    closePopover();
                }
            });

            $("#topnavigation_user_options_login_external").click(function(){return false;});

            $("#topnavigation_user_options_login_button_login").keydown(function(e) {
                // if user is not signed in we need to check when they tab out of the login form and close the login menu
                if (!e.shiftKey && e.which == $.ui.keyCode.TAB) {
                    mouseOverSignIn = false;
                    $(topnavUserLoginButton).trigger("mouseout");
                    $("html").trigger("click");
                }
            });

            $("#topnavigation_user_options_name, #topnavigation_user_options_login_external").keydown(function(e) {
                // hide signin or user options menu when tabbing out of the last menu option
                if (!e.shiftKey && e.which == $.ui.keyCode.TAB) {
                    closeMenu();
                    closePopover();
                }
            });

            $(topnavUserOptions).bind("click", decideShowLoginLogout);

            var doLogin = function(){
                $(topnavUserOptionsLoginButtonSigningIn).show();
                $(topnavUserOptionsLoginButtonCancel).hide();
                $(topnavuserOptionsLoginButtonLogin).hide();
                sakai.api.User.login({
                    "username": $(topnavUseroptionsLoginFieldsUsername).val(),
                    "password": $(topnavUseroptionsLoginFieldsPassword).val()
                }, function(success){
                    if (success) {
                        var redirectURL = getRedirectURL();
                        if (redirectURL === window.location.pathname + window.location.search + window.location.hash) {
                            window.location.reload(true);
                        } else {
                            window.location = redirectURL;
                        }
                    } else {
                        $(topnavUserOptionsLoginButtonSigningIn).hide();
                        $(topnavUserOptionsLoginButtonCancel).show();
                        $(topnavuserOptionsLoginButtonLogin).show();
                        $(topnavUseroptionsLoginFieldsPassword).val("");
                        $(topnavUseroptionsLoginFieldsPassword).focus();
                        $(topnavUseroptionsLoginFieldsUsername).addClass("failedloginusername");
                        $(topnavUseroptionsLoginFieldsPassword).addClass("failedloginpassword");
                        $(topnavUserOptionsLoginForm).valid();
                        $(topnavUseroptionsLoginFieldsUsername).removeClass("failedloginusername");
                        $(topnavUseroptionsLoginFieldsPassword).removeClass("failedloginpassword");
                    }
                });
            };

            $.validator.addMethod("failedloginusername", function(value, element){
                return false;
            }, sakai.api.i18n.getValueForKey("INVALID_USERNAME_OR_PASSWORD"));
            $.validator.addMethod("failedloginpassword", function(value, element){
                return false;
            }, "");
            var validateOpts = {
                submitHandler: function(form){
                    doLogin();
                }
            };
            // Initialize the validate plug-in
            sakai.api.Util.Forms.validate($(topnavUserOptionsLoginForm), validateOpts, true);

            // Make sure that the sign in dropdown does not disappear after it has
            // been clicked
            var mouseOverSignIn = false;
            var mouseClickedSignIn = false;
            $(topnavUserOptionsLoginFields).live('mouseenter', function(){
                mouseOverSignIn = true; 
            }).live('mouseleave', function(){ 
                mouseOverSignIn = false; 
            });
            $(topnavUserOptionsLoginFields).click(function(){
                mouseClickedSignIn = true;
                $(topnavUserOptionsLoginFields).addClass(topnavigationForceSubmenuDisplay);
                $(topnavigationlogin).addClass(topnavigationForceSubmenuDisplayTitle);
            });
            $("html").click(function(){ 
                if (!mouseOverSignIn) {
                    mouseClickedSignIn = false;
                    $(topnavUserOptionsLoginFields).removeClass(topnavigationForceSubmenuDisplay);
                    $(topnavigationlogin).removeClass(topnavigationForceSubmenuDisplayTitle);
                }
                closeMenu();
            });

            $(topnavUserLoginButton).bind("focus",function(){
                $(this).trigger("mouseover");
                mouseOverSignIn = true;
                $(topnavUserOptionsLoginFields).trigger('click');
                $(topnavigationlogin).addClass(topnavigationForceSubmenuDisplayTitle);
            });

            $("#topnavigation_search_input,#navigation_anon_signup_link,#topnavigation_user_inbox_container,.topnavigation_search .s3d-search-button").bind("focus",function(evt){
                mouseOverSignIn = false;
                $(topnavUserLoginButton).trigger("mouseout");
                $("html").trigger("click");

                if ($(this).attr("id") === "topnavigation_search_input") {
                // Search binding (don't fire on following keyup codes: shift)
                    $(this).keyup();
                    if ($.trim($("#topnavigation_search_input").val())) {
                        $("#topnavigation_search_results").show();
                    }
                }
            });

            $(topnavigationlogin).hover(function(){
                if ($("#navigation_anon_signup_link:focus").length){
                    $("#navigation_anon_signup_link:focus").blur();
                }
                closeMenu();
                closePopover();
                $(topnavUserOptionsLoginFields).show();
            },
            function(){
                $(topnavUserOptionsLoginFields).hide();
                if ($(this).children(topnavigationExternalLogin).length) {
                    $(this).children(topnavigationExternalLogin).find("ul").attr("aria-hidden", "true");
                }
            });

            $("#topnavigation_message_showall").live("click", hideMessageInlay);
            $("#topnavigation_message_readfull").live("click", hideMessageInlay);
            $(".no_messages .s3d-no-results-container a").live("click", hideMessageInlay);
            $(".topnavigation_trigger_login").live("click", forceShowLogin);

            $(window).bind("updated.messageCount.sakai", setCountUnreadMessages);
            $(window).bind("displayName.profile.updated.sakai", setUserName);
        };


        //////////////
        // OVERLAYS //
        //////////////

        var renderOverlays = function(){
            sakai.api.Widgets.widgetLoader.insertWidgets(tuid);
        };

        // Add content

        $(".sakai_add_content_overlay, #subnavigation_add_content_link").live("click", function(ev) {
            $(window).trigger("init.newaddcontent.sakai");
            return false;
        });

        // Send a message

        $(".sakai_sendmessage_overlay").live("click", function(ev){
            var el = $(this);
            var person = false;
            var people = [];
            if (el.attr("sakai-entityid") && el.attr("sakai-entityname")){
                var userIDArr = el.attr("sakai-entityid").split(",");
                var userNameArr = sakai.api.Security.safeOutput(el.attr("sakai-entityname")).split(",");
                for(var i = 0; i < userNameArr.length; i++){
                    people.push({
                        "uuid": userIDArr[i],
                        "username": userNameArr[i],
                        "type": el.attr("sakai-entitytype") || "user"
                    });
                }
            }
            $(window).trigger("initialize.sendmessage.sakai", [people]);
        });

        // Add to contacts

        $(".sakai_addtocontacts_overlay").live("click", function(ev){
            var el = $(this);
            if (el.attr("sakai-entityid") && el.attr("sakai-entityname")){
                var person = {
                    "uuid": el.attr("sakai-entityid"),
                    "displayName": el.attr("sakai-entityname"),
                    "pictureLink": el.attr("sakai-entitypicture") || false
                };
                $(window).trigger("initialize.addToContacts.sakai", [person]);
            }
        });

        // Join group

        $(".sakai_joingroup_overlay").live("click", function(ev){
            var el = $(this);
            if (el.attr("data-groupid")){
                $(window).trigger("initialize.joingroup.sakai", [el.attr("data-groupid"), el]);
            }
        });
        $("#topnavigation_scroll_to_top").live("click", function(ev) {
            $("html:not(:animated),body:not(:animated)").animate({
                scrollTop: $("html").offset().top
            }, 500 );
        });

        $(window).scroll(function(ev) {
            if($(window).scrollTop() > 800) {
                $('#topnavigation_scroll_to_top').show('slow');
            } else {
                $('#topnavigation_scroll_to_top').hide('slow');
            }
        });

        $(window).bind('sakai.mylibrary.deletedCollections', function(ev, data) {
            $.each(data.items, function(i, item) {
                $('.topnavigation_menuitem_counts_container #topnavigation_user_collections_total').text(parseInt($('.topnavigation_menuitem_counts_container #topnavigation_user_collections_total').text(), 10) - 1);
            });
        });

        $(window).bind('sakai.mylibrary.createdCollections', function(ev, data) {
            $.each(data.items, function(i, item) {
                $('.topnavigation_menuitem_counts_container #topnavigation_user_collections_total').text(parseInt($('.topnavigation_menuitem_counts_container #topnavigation_user_collections_total').text(), 10) + 1);
            });
        });

        $("#topnavigation_messages_container").live("click", function(){
            if($("#topnavigation_user_messages_container .s3d-dropdown-menu").is(":hidden")){
                sakai.api.Communication.getAllMessages("inbox", false, false, 1, 0, "_created", "desc", function(success, data){
                    var dataPresent = false;
                    if (data.results && data.results[0]) {
                        dataPresent = true;
                    }
                    $("#topnavigation_messages_container").addClass("selected");
                    var $messageContainer = $("#topnavigation_user_messages_container .s3d-dropdown-menu");
                    $openPopover = $messageContainer;
                    $messageContainer.html(sakai.api.Util.TemplateRenderer("topnavigation_messages_dropdown_template", {data: data, sakai: sakai, dataPresent: dataPresent}));
                    $messageContainer.show();
                });
            }
        }); 


        /////////////////////////
        /////// INITIALISE //////
        /////////////////////////

        /**
         * Initialise the topnavigation widget
         */
        var doInit = function(){
            checkForRedirect();
            renderMenu();
            renderUser();
            setCountUnreadMessages();
            setUserName();
            addBinding();
            renderOverlays();
            forceShowLoginUrl();
        };

        doInit();
    };

    sakai_global.addpeoplegroups = function(tuid, showSettings) {

        var $rootel = $("#" + tuid);
        var $addpeoplegroupsWidget = $("#addpeoplegroups_widget", $rootel);
        var addpeoplegroupsClose = ".addpeoplegroups_close";
        var addpeoplegroupsTrigger = ".addpeoplegroups_trigger";
        var addpeoplegroupsSave = "#addpeoplegroups_save";
        var targetSelectGroup = "addpeoplegroups_checkbox";
        var renderObj = {};
        var membershipFetched = 0;
        var selectedTitles = [];
        var selectedIDs = [];

        var getSelected = function(){
            var selected = [];
            if(selectedTitles.length > 1 && !$.isArray(selectedTitles)){
                selectedTitles = selectedTitles.split(",");
                selectedIDs = selectedIDs.split(",");
            }
            $.each(selectedTitles, function(i, title) {
                selected.push({
                    id: selectedIDs[i],
                    title: title
                });
            });
            return selected;
        };

        var getSelectedIDs = function(){
            var selected = [];
            $.each(selectedIDs, function(i, id){
                if (id !== sakai.data.me.user.userid) {
                    selected.push(id);
                }
            });
            return selected;
        };

        var renderTemplate = function(){
            $("#addpeoplegroups_container").html(sakai.api.Util.TemplateRenderer("addpeoplegroups_template", renderObj));
            $addpeoplegroupsWidget.toggle();
        };

        /**
         * Determines if the selected groups are a part of any groups
         */
        var selectAlreadyGroupMember = function(){
            $.each(renderObj.memberOfGroups.entry, function(j, memberOfGroup){
                var alreadyMember = true;
                $.each(getSelected(), function(i, selectedAuthorizable){
                    if ($.inArray(selectedAuthorizable.id, memberOfGroup.members) === -1 && selectedAuthorizable.id !== memberOfGroup["sakai:group-id"]){
                        alreadyMember = false;
                    }
                });
                memberOfGroup.alreadyMember = alreadyMember;
            });
            renderTemplate();
        };

        /**
         * Gets memberships for all groups you're a member of to be able to match them to the selected groups
         */
        var getMemberships = function(){
            var groupsToFetch = [];
            var membershipsManage = [];
            $.each(renderObj.memberOfGroups.entry, function(index, item){
                groupsToFetch.push(item["sakai:group-id"]);
            });
            if(renderObj.memberOfGroups.entry.length){
                // First fetch the group info so we can tell whether the current user can manage any of the groups
                sakai.api.Groups.getGroupAuthorizableData(groupsToFetch, function(success, groupData){
                    $.each(groupData, function(index, group){
                        $.each(renderObj.memberOfGroups.entry, function(m, membership){
                            if (membership["sakai:group-id"] === group.properties["sakai:group-id"]){
                                membership.canManage = false;
                                var roles = sakai.api.Groups.getRoles({"roles": $.parseJSON(group.properties["sakai:roles"])}, true);
                                $.each(roles, function(r, role){
                                    if (role.isManagerRole){
                                        var isMember = sakai.api.Groups.isCurrentUserAMember(membership["sakai:group-id"] + "-" + role.id, sakai.data.me);
                                        if (isMember){
                                            membership.canManage = true;
                                        }
                                    }
                                });
                                if (membership.canManage){
                                    membershipsManage.push(membership);
                                }
                            }
                        });
                    });
                    // Now fetch all members of all groups
                    renderObj.memberOfGroups.entry = membershipsManage;
                    sakai.api.Groups.getMembers(groupsToFetch, function(success, data){
                        $.each(renderObj.memberOfGroups.entry, function(g, membership){
                            membership.members = [];
                            var groupRoles = data[membership["sakai:group-id"]] || {};
                            $.each(groupRoles, function(r, role){
                                $.each(role.results, function(u, user){
                                    membership.members.push(user["rep:userId"] || user.groupid);
                                });
                            });
                        });
                        selectAlreadyGroupMember();
                    });
                });
            } else {
                renderTemplate();
            }
        };

        var toggleVisibility = function(){
            // Fill up initial values in object to send to renderer
            renderObj = {
                api: sakai.api,
                groups: getSelected(),
                memberOfGroups: sakai.api.Groups.getMemberships(sakai.data.me.groups),
                worlds: sakai.config.worldTemplates
            };
            // Check if groups are part of my library
            if(!$addpeoplegroupsWidget.is(":visible")){
                getMemberships();
            } else {
                $addpeoplegroupsWidget.toggle();
            }
        };

        var saveMemberships = function(){
            $(addpeoplegroupsSave, $rootel).attr("disabled", true);
            var $addPeopleGroupsSelect = $("#addpeoplegroups_select");
            if(!$addPeopleGroupsSelect.children("option:selected").data("redirect") === true){
                var groupsToAdd = [];
                $.each(getSelected(), function(i, selectedGroup){
                    sakai.api.Groups.getGroupAuthorizableData($addPeopleGroupsSelect.val(), function(success, data){
                        data = data[$addPeopleGroupsSelect.val()];
                        groupsToAdd.push({
                            user: selectedGroup.id,
                            permission: data.properties["sakai:joinRole"]
                        });
                    });
                });
                sakai.api.Groups.addUsersToGroup($addPeopleGroupsSelect.val(), groupsToAdd, sakai.data.me);
                $(addpeoplegroupsSave, $rootel).removeAttr("disabled");
                toggleVisibility();
                sakai.api.Util.notification.show(sakai.api.i18n.getValueForKey("SUCCESSFULLY_ADDED", "addpeoplegroups"), sakai.api.Util.TemplateRenderer("addpeoplegroups_added_template", {
                    groupsToAdd: getSelected(),
                    groupToAddTo: $("#addpeoplegroups_select option[value='" + $addPeopleGroupsSelect.val() + "']").text()
                }));
            } else {
                document.location = "/create#l=" + $addPeopleGroupsSelect.val() + "&members=" + getSelectedIDs().toString();
            }
        };

        var addBinding = function(){
            sakai.api.Util.hideOnClickOut($addpeoplegroupsWidget, addpeoplegroupsTrigger + "," + addpeoplegroupsClose);
            $(addpeoplegroupsClose, $rootel).die("click", toggleVisibility);
            $(addpeoplegroupsClose, $rootel).live("click", toggleVisibility);
            $(addpeoplegroupsSave, $rootel).die("click", saveMemberships);
            $(addpeoplegroupsSave, $rootel).live("click", saveMemberships);
        };

        var doInit = function(el){
            toggleVisibility();
            $addpeoplegroupsWidget.css("top", $(el).position().top + 24);
            $addpeoplegroupsWidget.css("left", $(el).position().left - ($addpeoplegroupsWidget.width() / 2) + ($(el).width() / 2 + 10) );
        };

        $(".addpeoplegroups_trigger").live("click", function(){
            selectedTitles = $(".addpeoplegroups_trigger:visible").data("entityname");
            selectedIDs = $(".addpeoplegroups_trigger:visible").data("entityid");
            if(!$addpeoplegroupsWidget.is(":visible")){
                addBinding();
                doInit(this);
            } else {
                toggleVisibility();
            }
        });
    };



    sakai_global.addtocontacts = function(tuid, showSettings){


        /////////////////////////////
        // Configuration variables //
        /////////////////////////////

        var $rootel = $("#" + tuid);

        // Help variables
        var contactToAdd = false;

        // CSS selectors
        var addToContacts = "#addtocontacts";
        var addToContactsClass = ".addtocontacts";

        var addToContactsDialog = addToContacts + "_dialog";
        var addToContactsDone = addToContacts + "_done";
        var addToContactsDoneContainer = addToContacts + "_done_container";

        // Form elements
        var addToContactsForm = addToContacts + "_form";
        var addToContactsFormButtonInvite = addToContactsForm + "_invite";
        var addToContactsFormButtonCancel = addToContactsForm + "_cancel";
        var addToContactsFormPersonalNote = addToContactsForm + "_personalnote";
        var addToContactsFormPersonalNoteTemplate = addToContactsFormPersonalNote + "_template";
        var addToContactsFormType = addToContactsForm + "_type";
        var addToContactsFormTypeTemplate = addToContactsFormType + "_template";
        // Profile info
        var addToContactsInfoProfilePicture = addToContacts + "_profilepicture";
        var addToContactsInfoTypes = addToContacts + "_types";
        var addToContactsInfoDisplayName = addToContactsClass + "_displayname";

        // Error messages
        var addToContactsError = addToContacts + "_error";
        var addToContactsErrorMessage = addToContactsError + "_message";
        var addToContactsErrorRequest = addToContactsError + "_request";
        var addToContactsErrorNoTypeSelected = addToContactsError + "_noTypeSelected";

        var addToContactsResponse = addToContacts + "_response";

        ///////////////////
        // Functionality //
        ///////////////////

        /**
         * Disables or enables the invite button on the widget
         * @param {Boolean} disable Flag to disable or enable the button
         */
        var enableDisableInviteButton = function(disable){
            if(disable){
                $(addToContactsFormButtonInvite).attr("disabled","disabled");
            }else{
                $(addToContactsFormButtonInvite).removeAttr("disabled");
            }
        };

        /**
         * Render the templates that are needed for the add contacts widget.
         * It renders the contacts types and the personal note
         */
        var renderTemplates = function(){
            sakai.api.Util.TemplateRenderer(addToContactsFormTypeTemplate.replace(/#/gi, ""), {
                "relationships": sakai.config.Relationships,
                "sakai": sakai
            }, $(addToContactsInfoTypes));
            var json = {
                sakai: sakai,
                me: sakai.data.me
            };
            sakai.api.Util.TemplateRenderer(addToContactsFormPersonalNoteTemplate.replace(/#/gi, ""), json, $(addToContactsFormPersonalNote));
        };

        /**
         * This method will fill in the info for the user.
         * @param {Object} user The JSON object containing the user info. This follows the /rest/me format.
         */
        var fillInUserInfo = function(user){
            if (user) {
                $(addToContactsInfoDisplayName, $rootel).text(user.displayName);
                if (!user.pictureLink) {
                    user.pictureLink = sakai.api.Util.constructProfilePicture(user);
                }
                // Check for picture
                if (user.pictureLink) {
                    $(addToContactsInfoProfilePicture).html('<img alt="' + $("#addtocontacts_profilepicture_alt").html() + '" src="' + user.pictureLink + '" class="s3d-icon-50" />');
                } else {
                    $(addToContactsInfoProfilePicture).html('<img alt="' + $("#addtocontacts_profilepicture_alt").html() + '" src="' + sakai.config.URL.USER_DEFAULT_ICON_URL + '" class="s3d-icon-50" />');
                }
            }
        };

        /**
         * This function looks up and retrieves relationship information from a set of pre-defined relationships
         * @param {String} relationshipName
         */
        var getDefinedRelationship = function(relationshipName){
            for (var i = 0, j = sakai.config.Relationships.contacts.length; i < j; i++) {
                var definedRelationship = sakai.config.Relationships.contacts[i];
                if (definedRelationship.name === relationshipName) {
                    return definedRelationship;
                }
            }
            return null;
        };

        /**
         * Does the invitation stuff. Will send a request for an invitation and a message to the user.
         * @param {String} userid
         */
        var doInvite = function(userid){
            enableDisableInviteButton(true);
            var formValues = $(addToContactsForm).serializeObject();
            var types = formValues[addToContactsFormType.replace(/#/gi, "")];
            if (!$.isArray(types)) {
                types = [types];
            }
            $(addToContactsResponse).text("");
            if (types.length) {
                var fromRelationshipsToSend = [];
                var toRelationshipsToSend = [];
                for (var i = 0, j = types.length; i < j; i++) {
                    var type = types[i];
                    fromRelationshipsToSend.push(type);
                    var definedRelationshipToSend = getDefinedRelationship(type);
                    if (definedRelationshipToSend && definedRelationshipToSend.inverse) {
                        toRelationshipsToSend.push(definedRelationshipToSend.inverse);
                    }
                    else {
                        toRelationshipsToSend.push(type);
                    }
                }

                var personalnote = $.trim(formValues[addToContactsFormPersonalNote.replace(/#/gi, '')]);

                // send message to other person
                var userstring = $.trim(sakai.api.User.getDisplayName(sakai.data.me.profile));

                var title = $.trim($("#addtocontacts_invitation_title_key").text().replace(/\$\{user\}/g, userstring));
                var message = $.trim($("#addtocontacts_invitation_body_key").text().replace(/\$\{user\}/g, userstring).replace(/\$\{comment\}/g, personalnote).replace(/\$\{br\}/g,"\n"));

                // Do the invite and send a message
                $.ajax({
                    url: "/~" + sakai.api.Util.safeURL(sakai.data.me.user.userid) + "/contacts.invite.html",
                    type: "POST",
                    traditional: true,
                    data: {
                        "fromRelationships": fromRelationshipsToSend,
                        "toRelationships": toRelationshipsToSend,
                        "targetUserId": userid
                    },
                    success: function(data){
                        enableDisableInviteButton(false);
                        sakai.api.Util.Modal.close(addToContactsDialog);
                        sakai.api.Communication.sendMessage(userid, sakai.data.me, title, message, "invitation", false,false,true,"contact_invitation");
                        $(window).trigger("sakai.addToContacts.requested", [contactToAdd]);
                        //reset the form to set original note
                        $(addToContactsForm)[0].reset();
                        sakai.api.Util.notification.show("", $(addToContactsDone, $rootel).html());
                        // record that user made contact request
                        sakai.api.User.addUserProgress("madeContactRequest");
                        // display tooltip
                        var tooltipData = {
                            "tooltipSelector":"#search_button",
                            "tooltipTitle":"TOOLTIP_ADD_CONTACTS",
                            "tooltipDescription":"TOOLTIP_ADD_CONTACTS_P5",
                            "tooltipTop":-175,
                            "tooltipLeft":0,
                            "tooltipAutoClose":true
                        };
                        $(window).trigger("update.tooltip.sakai", tooltipData);
                    },
                    error: function(xhr, textStatus, thrownError){
                        enableDisableInviteButton(false);
                        $(addToContactsResponse).text(sakai.api.Security.saneHTML($(addToContactsErrorRequest).text()));
                    }
                });

            }
            else {
                enableDisableInviteButton(false);
                $(addToContactsResponse).text(sakai.api.Security.saneHTML($(addToContactsErrorNoTypeSelected).text()));
            }
        };

        ///////////////////////
        // jqModal functions //
        ///////////////////////

        /**
         * This will load the overlay to add a new contact.
         * This method will fill in all the user info.
         * @param {Object} hash The layover object we get from jqModal
         */
        var loadDialog = function(hash){
            $("#addtocontacts_dialog_title").html($("#addtocontacts_dialog_title_template").html().replace("${user}", sakai.api.Security.safeOutput(contactToAdd.displayName)));
            hash.w.show();
        };

        /////////////////////////
        // Initialise function //
        /////////////////////////

        /**
         * People should call this function if they want to initiate the widget
         * @param {Object} user The userid or the /rest/me info for this user.
         * @param {Function} callback The callback function that will be executed after the request.
         */
        var initialize = function(user){
            user.userid = user.userid || user.uuid;
            contactToAdd = user;
            fillInUserInfo(contactToAdd);

            // Render the templates
            renderTemplates();

            // Show the layover
            sakai.api.Util.Modal.open(addToContactsDialog);

        };

        $(window).bind("initialize.addToContacts.sakai", function(e, userObj) {
            initialize(userObj);
        });

        /////////////////////
        // Event listeners //
        /////////////////////

        // Bind the invite button
        $(addToContactsFormButtonInvite).bind("click", function(){
            // Invite this person.
            doInvite(contactToAdd.userid);
            return false;
        });

        // Bind the cancel button
        $(addToContactsFormButtonCancel).click(function(){
            $(addToContactsForm)[0].reset();

            // display tooltip
            var tooltipData = {
                "tooltipSelector":"#search_button",
                "tooltipTitle":"TOOLTIP_ADD_CONTACTS",
                "tooltipDescription":"TOOLTIP_ADD_CONTACTS_P3",
                "tooltipTop":-150,
                "tooltipLeft":-200
            };
            $(window).trigger("update.tooltip.sakai", tooltipData);
        });

        $(".jqmClose").bind("click", function(){
            // display tooltip
            var tooltipData = {
                "tooltipSelector":"#search_button",
                "tooltipTitle":"TOOLTIP_ADD_CONTACTS",
                "tooltipDescription":"TOOLTIP_ADD_CONTACTS_P3",
                "tooltipTop":-150,
                "tooltipLeft":-200
            };
            $(window).trigger("update.tooltip.sakai", tooltipData);
        });

        // Bind the jqModal
        sakai.api.Util.Modal.setup(addToContactsDialog, {
            modal: true,
            overlay: 20,
            toTop: true,
            onShow: loadDialog
        });
    };


    sakai_global.branding = function(tuid, showSettings) {

        var $rootel = $('#' + tuid);
        var $brandingWidget = $('.branding_widget', $rootel);

        var doInit = function() {
            if (sakai.config.enableBranding) {
                $brandingWidget.show();
            }
        };

        doInit();

    };
    
    
    sakai_global.changepic = function(tuid, showSettings){


        //////////////////////
        // Config Variables //
        //////////////////////

        var realw = 0;
        var realh = 0;
        var picture = false;
        var ratio = 1;
        var userSelection = null; // The object returned by imgAreaSelect that contains the user his choice.
        var originalPic = null; // current or default selection area
        var me = null;
        var imageareaobject;
        var id = null;
        var mode = null;
        var fullPicHeight = 300;
        var fullPicWidth = 325;

        // These values are just in case there are no css values specified.
        // If you want to change the size of a thumbnail please do this in the CSS.
        var thumbnailWidth = 100;
        var thumbnailHeight = 100;


        //////////////
        // CSS IDS  //
        //////////////

        var containerTrigger = '#changepic_container_trigger'; // This is the id that will trigger this widget.

        // others
        var selectContentArea = "#changepic_selectpicture";
        var container = "#changepic_container";
        var picForm = "#changepic_form";
        var picInput = "#profilepicture";
        var picInputError = "#changepic_nofile_error";
        var uploadProcessing = "#changepic_uploading";
        var uploadNewButtons = "#changepic_uploadnew_buttons";
        var uploadNewCancel = "#profile_upload_cancel";
        var pictureMeasurer = "#picture_measurer";
        var pictureMeasurerImage = "#picture_measurer_image";
        var saveNewSelection = "#save_new_selection";
        var fullPicture = "#changepic_fullpicture_img";
        var fullPictureSpan = "#changepic_fullpicture";
        var thumbnail = "#thumbnail_img";
        var thumbnailSpan = "#thumbnail";
        var thumbnailContainer = "#thumbnail_container";
        var picInputErrorClass = "changepic_input_error";
        var fileName = false;
        var existingPicture = false;

        // An array with selectors pointing to images that need to be changed.
        var imagesToChange = ['#picture_holder img', '#entity_profile_picture', '#myprofile_pic', '#profile_userinfo_picture'];


        ///////////////////
        // UTIL FUNCTIONS //
        ///////////////////

         /**
         * Hides and reset image select area
         */
        var hideSelectArea = function(){
            if (imageareaobject) {
                imageareaobject.setOptions({
                    hide: true,
                    disable: true
                });
                imageareaobject.update();
            }

            $(selectContentArea).hide();
            $(uploadNewCancel).show();
        };

         /**
         * Shows image select area
         */
        var showSelectArea = function(){
            $(uploadNewCancel).hide();
            $(selectContentArea).show();
        };

        /**
         * When the user has drawn a square this function will be called by imgAreaSelect.
         * This will draw the thumbnail by modifying it's css values.
         * @param {Object} img    The thumbnail
         * @param {Object} selection The selection object from imgAreaSelect
         */
        var preview = function(img, selection){
            // Save the user his selection in a global variable.
            userSelection = selection;

            // How much has the user scaled down the image?
            var scaleX = thumbnailWidth / (selection.width || 1);
            var scaleY = thumbnailHeight / (selection.height || 1);

            // Change the thumbnail according to the user his selection via CSS.
            $(thumbnail).css({
                width: Math.round(scaleX * img.width) + 'px',
                height: Math.round(scaleY * img.height) + 'px',
                marginLeft: '-' + Math.round(scaleX * selection.x1) + 'px',
                marginTop: '-' + Math.round(scaleY * selection.y1) + 'px'
            });
        };

        /**
         * Shows file input error
         */
        var showInputError = function(){
            $(picInputError).show();
            $(picInput).addClass(picInputErrorClass);
            if ($(selectContentArea + ":visible") && imageareaobject){
                imageareaobject.update();
            }
        };

        /**
         * Hides file input error
         */
        var hideInputError = function(){
            $(picInputError).hide();
            $(picInput).removeClass(picInputErrorClass);
            if ($(selectContentArea + ":visible") && imageareaobject){
                imageareaobject.update();
            }
        };

         /**
         * Empty upload field by resetting the form
         */
        var resetUploadField = function(){
            $(picForm).reset();
            hideInputError();
            $(uploadProcessing).hide();
            $(uploadNewButtons).show();
            $('#profile_upload').attr('disabled', 'disabled');
        };

        // Add click event to all cancel buttons in the overlay
        // Since file upload form is reset every time overlay closes do this in init function
        $("#changepic_container .jqmClose").click(function(){
            resetUploadField();
            // hide any tooltips if they are open
            $(window).trigger("done.tooltip.sakai");
        });

        /**
         * On changepic form submit, check that a file has been selected
         * and submit the form.
         */
        $("#profile_upload").unbind("click").bind("click", function(){
            // validate args
            // file extension allow for image
            var extensionArray = [".png", ".jpg", ".jpeg",".gif"];
            // get file name
            fileName = $(picInput).val();
            // get extension from the file name.
            var extension = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
            var allowSubmit = false;

            for (var i = 0; i < extensionArray.length; i++) {
                 // extension is acceptable image format
                 if (extensionArray[i] === extension) {
                    allowSubmit = true;
                    break;
                 }
            }
            // if image format is acceptable
            if(allowSubmit) {
                hideInputError();
                $(uploadNewButtons).hide();
                $(uploadProcessing).show();
                fileName = "tmp" + new Date().getTime() + ".jpg";
                $(picInput).attr("name",fileName);
                hideSelectArea();
                $(picForm).ajaxForm({
                    success: function(data){
                        doInit(true);
                    },
                    error: function(){
                        showInputError();
                        return false;
                    }
                });
                $(picForm).submit();
            } else {
                // no input, show error
                showInputError();
                return false;
            }
        });

        /**
         * Initilise function
         * @param {boolean} newpic True if a new picture has just been uploaded
         */
        var doInit = function(newpic){
            hideSelectArea();

            if (!id) {
                id = sakai.data.me.user.userid;
                mode = "user";
            }

            var showPicture = true;
            var json;

            if (mode === "group") {
                // fetch group data to check if it has a picture
                $.ajax({
                    url: "/~" + id + "/public.infinity.json",
                    async: false,
                    success: function(data){
                        json = data.authprofile;
                    }
                });
            } else {
                // Check whether there is a base picture at all
                me = sakai.data.me;
                json = me.profile;
            }
            // If the image is freshly uploaded then reset the imageareaobject to reset all values on init
            if (newpic) {
                imageareaobject = null;
                picture = {
                    "_name": fileName,
                    "selectedx1":0,
                    "selectedy1":0,
                    "selectedx2":64,
                    "selectedy2":64
                };
            }
            else if (json.picture) {
                picture = $.parseJSON(json.picture);
            } else {
                showPicture = false;
            }

            $(picForm).attr("action", "/~" + sakai.api.Util.safeURL(id) + "/public/profile");

            // Get the preferred size for the thumbnail.
            var prefThumbWidth = parseInt($(thumbnailContainer).css("width").replace(/px/gi,""), 10);
            var prefThumbHeight = parseInt($(thumbnailContainer).css("height").replace(/px/gi,""), 10);

            // Make sure we don't have 0
            thumbnailWidth  = (prefThumbWidth > 0) ? prefThumbWidth : thumbnailWidth;
            thumbnailHeight  = (prefThumbHeight > 0) ? prefThumbHeight : thumbnailHeight;

            if (showPicture && picture && picture._name) {
                // The user has already uploaded a picture.
                // Show the image select area
                existingPicture = true;

                // Set the unvisible image to the full blown image. (make sure to filter the # out)
                $(pictureMeasurer).html(sakai.api.Security.saneHTML("<img src='" + "/~" + sakai.api.Util.safeURL(id) + "/public/profile/" + picture._name + "?sid=" + Math.random() + "' id='" + pictureMeasurerImage.replace(/#/gi, '') + "' />"));

                // Check the current picture's size
                $(pictureMeasurerImage).bind("load", function(ev){
                    resetUploadField();

                    // save the image size in global var.
                    realw = $(pictureMeasurerImage).width();
                    realh = $(pictureMeasurerImage).height();

                    // Set the images
                    $(fullPictureSpan).html('<img alt="' + $("#changepic_fullpicture_alt").html() + '" id="changepic_fullpicture_img" src="/~' + id + "/public/profile/" + picture._name + "?sid=" + Math.random() + '" />');
                    $(thumbnailSpan).html('<img alt="' + $("#thumbnail_alt").html() + '" id="thumbnail_img" src="/~' + id + "/public/profile/" + picture._name + "?sid=" + Math.random() + '" />');

                    // Reset ratio
                    ratio = 1;

                    // fullPicWidth (500) and fullPicHeight (300) set in config variables
                    // Width < 500 ; Height < 300 => set the original height and width
                    if (realw < fullPicWidth && realh < fullPicHeight){
                        $(fullPicture).width(realw);
                        $(fullPicture).height(realh);

                    // Width > 500 ; Height < 300 => Width = 500
                    } else if (realw > fullPicWidth && (realh / (realw / fullPicWidth) < fullPicHeight)){
                        ratio = realw / fullPicWidth;
                        $(fullPicture).width(fullPicWidth);
                        $(fullPicture).height(Math.floor(realh / ratio));

                    // Width < 500 ; Height > 300 => Height = 300
                    } else if (realh > fullPicHeight && (realw / (realh / fullPicHeight) < fullPicWidth)) {
                        ratio = realh / fullPicHeight;
                        $(fullPicture).height(fullPicHeight);
                        $(fullPicture).width(Math.floor(realw / ratio));

                    // Width > 500 ; Height > 300
                    } else if (realh > fullPicHeight && (realw / (realh / fullPicHeight) > fullPicWidth)) {

                        var heightonchangedwidth = realh / (realw / fullPicWidth);
                        if (heightonchangedwidth > fullPicHeight){
                            ratio = realh / fullPicHeight;
                            $(fullPicture).height(fullPicHeight);
                        } else {
                            ratio = realw / fullPicWidth;
                            $(fullPicture).width(fullPicWidth);
                        }
                    }

                    var selectionObj = {
                        width : picture.selectedx2 - picture.selectedx1,
                        height :picture.selectedy2 - picture.selectedy1,
                        x1 : picture.selectedx1,
                        y1 : picture.selectedy1,
                        x2 : picture.selectedx2,
                        y2 : picture.selectedy2,
                        picture : picture._name
                    };
                    if (!newpic){
                        originalPic = selectionObj;
                    }

                    // Set the imgAreaSelect to a function so we can access it later on
                    imageareaobject = $(fullPicture).imgAreaSelect({
                        aspectRatio: "1:1",
                        enable: true,
                        show: true,
                        instance: true,
                        onInit: function(){
                            // If the image gets loaded, make a first selection
                            imageareaobject.setSelection(picture.selectedx1, picture.selectedy1, picture.selectedx2, picture.selectedy2);
                            imageareaobject.setOptions({show: true, enable: true});
                            imageareaobject.update();
                            preview($("img" + fullPicture)[0], selectionObj);
                            // display help tooltip
                            var tooltipData = {
                                "tooltipSelector":"#save_new_selection",
                                "tooltipTitle":"TOOLTIP_ADD_MY_PHOTO",
                                "tooltipDescription":"TOOLTIP_ADD_MY_PHOTO_P4",
                                "tooltipArrow":"top",
                                "tooltipLeft":50
                            };
                            $(window).trigger("update.tooltip.sakai", tooltipData);
                        },
                        onSelectChange: preview
                    });
                    showSelectArea();
                });

                // if there is upload error show the error message
                $(pictureMeasurerImage).bind("error", function(){
                    showInputError();
                });
            }
        };

        // Remove error notification when a new file is chosen
        $(picInput).bind("change", function(){
            hideInputError();
            $('#profile_upload').removeAttr('disabled');
            // display help tooltip
            var tooltipData = {
                "tooltipSelector":"#profile_upload",
                "tooltipTitle":"TOOLTIP_ADD_MY_PHOTO",
                "tooltipDescription":"TOOLTIP_ADD_MY_PHOTO_P3",
                "tooltipArrow":"bottom"
            };
            $(window).trigger("update.tooltip.sakai", tooltipData);
        });

        // This is the function that will be called when a user has cut out a selection
        // and saves it.
        $(saveNewSelection).click(function(ev){
            if (!userSelection) {
                userSelection = imageareaobject.getSelection();
                savePicture();
            } else if (originalPic &&
                (userSelection.x1 === originalPic.x1 &&
                userSelection.x2 === originalPic.x2 &&
                userSelection.y1 === originalPic.y1 &&
                userSelection.y2 === originalPic.y2 &&
                userSelection.picture === originalPic.picture)){
                // no need to save if picture hasn't changed, so just close the dialog
                // Hide the layover.
                sakai.api.Util.Modal.close(container);
            } else {
                savePicture();
            }
        });

        /**
         * savePicture
         */
        var savePicture = function(){
            // The parameters for the cropit service.
            var data = {
                img: "/~" + id + "/public/profile/" + picture._name,
                save: "/~" + id + "/public/profile",
                x: Math.floor(userSelection.x1 * ratio),
                y: Math.floor(userSelection.y1 * ratio),
                width: Math.floor(userSelection.width * ratio),
                height:Math.floor(userSelection.height * ratio),
                dimensions: "256x256",
                "_charset_":"utf-8"
            };

            if(data.width === 0 || data.height === 0){
                data.width = $(fullPicture).width();
                data.height = $(fullPicture).height();
                data.x = 0;
                data.y = 0;
            }

            // Post all of this to the server
            $.ajax({
                url: sakai.config.URL.IMAGE_SERVICE,
                type: "POST",
                data: data,
                success: function(data){

                    var tosave = {
                        "name": "256x256_" + picture._name,
                        "_name": picture._name,
                        "_charset_":"utf-8",
                        "selectedx1" : userSelection.x1,
                        "selectedy1" : userSelection.y1,
                        "selectedx2" : userSelection.width + userSelection.x1,
                        "selectedy2" : userSelection.height + userSelection.y1
                    };

                    var stringtosave = $.toJSON(tosave);

                    sakai.data.me.profile.picture = stringtosave;

                    // Do a patch request to the profile info so that it gets updated with the new information.
                    $.ajax({
                        url: "/~" + sakai.api.Util.safeURL(id) + "/public/authprofile.profile.json",
                        type : "POST",
                        data : {
                            "picture" : $.toJSON(tosave),
                            "_charset_":"utf-8"
                        },
                        success : function(data) {
                            // Change the picture in the page. (This is for my_sakai.html)
                            // Math.random is for cache issues.
                            for (var i = 0; i < imagesToChange.length;i++) {
                                $(imagesToChange[i]).attr("src", "/~" + id + "/public/profile/" + tosave.name + "?sid=" + Math.random());
                            }

                            // display help tooltip
                            var tooltipData = {
                                "tooltipSelector":"#systemtour_add_photo",
                                "tooltipTitle":"TOOLTIP_ADD_MY_PHOTO",
                                "tooltipDescription":"TOOLTIP_ADD_MY_PHOTO_P5",
                                "tooltipArrow":"top",
                                "tooltipTop":25,
                                "tooltipLeft":40,
                                "tooltipAutoClose":true
                            };
                            $(window).trigger("update.tooltip.sakai", tooltipData);

                            // Hide the layover.
                            sakai.api.Util.Modal.close(container);

                            if (mode !== "group") {
                                // record that user uploaded their profile picture
                                sakai.api.User.addUserProgress("uploadedProfilePhoto");
                            } else if (sakai.currentgroup && sakai.currentgroup.data && sakai.currentgroup.data.authprofile) {
                                sakai.currentgroup.data.authprofile.picture = $.toJSON(tosave);
                            }
                        },
                        error: function(xhr, textStatus, thrownError) {
                            sakai.api.Util.notification.show(sakai.api.i18n.getValueForKey("AN_ERROR_HAS_OCCURRED"),"",sakai.api.Util.notification.type.ERROR);
                        }
                    });

                },
                error: function(xhr, textStatus, thrownError) {
                    sakai.api.Util.notification.show(sakai.api.i18n.getValueForKey("AN_ERROR_HAS_OCCURRED"),"",sakai.api.Util.notification.type.ERROR);
                }
            });

        };


        ////////////////////////////
        // jQuery Modal functions //
        ////////////////////////////

        /**
         * Hide the layover
         * @param {Object} hash the object that represents the layover
         */
        var hideArea = function(hash){
            // Remove the selecting of an area on an image.
            if (imageareaobject) {
                imageareaobject.setOptions({
                    hide: true,
                    disable: true
                });
                imageareaobject.update();
            }

            hash.w.hide();
            hash.o.remove();
        };

        /**
         * Show the layover.
         * @param {Object} hash
         */
        var showArea = function(hash){
            doInit();
            hash.w.show();
            if (!existingPicture) {
                // display help tooltip
                var tooltipData = {
                    "tooltipSelector": "#profilepicture",
                    "tooltipTitle": "TOOLTIP_ADD_MY_PHOTO",
                    "tooltipDescription": "TOOLTIP_ADD_MY_PHOTO_P2",
                    "tooltipArrow": "top"
                };
                $(window).trigger("update.tooltip.sakai", tooltipData);
            }
        };

        sakai.api.Util.Modal.setup(container, {
            modal: true,
            overlay: 20,
            toTop: true,
            onHide: hideArea,
            onShow: showArea
        });

        $(containerTrigger).live("click", function(){
            // This will make the widget popup as a layover.
            sakai.api.Util.Modal.open(container);
        });

        $(window).bind("setData.changepic.sakai", function(e, _mode, _id) {
            mode = _mode;
            id = _id;
        });

        $(window).trigger("ready.changepic.sakai");
    };
    
    
    
    
    sakai_global.deletecontent = function(tuid, showSettings){

        //////////////////////
        // Global variables //
        //////////////////////

        var pathsToDelete = false;
        var contentIManage = false;
        var contentIView = false;
        var context = false;
        var callback = false;
        var contextType = false;

        ///////////////////
        // CSS Selectors //
        ///////////////////

        var $deletecontent_dialog = $("#deletecontent_dialog");

        ////////////////////////////
        // Batch request handling //
        ////////////////////////////

        /**
         * Once all requests have been collected into a batchRequest array, we can submit them as
         * a batch request
         * @param {Object} batchRequests    Array that contains all batch requests to be submitted
         * @param {Object} successMessage   Id of the dom element that contains the success message to be displayed
         */
        var sendDeletes = function(batchRequests, successMessage) {
            sakai.api.Util.progressIndicator.showProgressIndicator(
                sakai.api.i18n.getValueForKey('REMOVING_CONTENT'),
                sakai.api.i18n.getValueForKey('PROCESSING_REMOVING'));
            // Update the inserter
            $.each(collectionsToUpdate, function(collectionId, amount) {
                $.each(sakai.api.User.data.me.groups, function(index, group){
                    if (group && group.counts && group.groupid === collectionId) {
                        group.counts.contentCount -= amount;
                        collectionId = collectionId.substring(2,collectionId.length);
                        $(window).trigger('updateCount.inserter.sakai', [collectionId, group.counts.contentCount]);
                    }
                });
            });
            sakai.api.Server.batch(batchRequests, function (success, data) {
                if (success) {
                    sakai.api.Util.notification.show($("#deletecontent_message_title").html(), $(successMessage).html());
                } else {
                    sakai.api.Util.error.show($("#deletecontent_message_title").html(), $("#deletecontent_message_error").html()); 
                }

                $(window).trigger("done.deletecontent.sakai", [pathsToDelete]);
                if ($.isFunction(callback)) {
                    callback(success);
                }
                sakai.api.Util.progressIndicator.hideProgressIndicator();
                sakai.api.Util.Modal.close($deletecontent_dialog);
            });
        };

        //////////////////////////////
        // Remove from library only //
        //////////////////////////////

        /**
         * Add one request for each item to be removed from the current library
         * @param {Object} batchRequests    Array to which to add the requests for removing the content
         * @param {Object} items            Content items to be removed from the current library
         */
        var processRemoveFromLibrary = function(batchRequests, items){
            batchRequests = batchRequests || [];
            for (var i = 0; i < items.length; i++){
                var parameters = {};
                if (sakai.api.Content.Collections.isCollection(items[i])) {
                    var groupId = sakai.api.Content.Collections.getCollectionGroupId(items[i]);
                    batchRequests.push({
                        "url": "/system/userManager/group/" + groupId + "-members.update.json",
                        "method": "POST",
                        "parameters": {
                            ":viewer@Delete": context,
                            ":member@Delete": context
                        }
                    });
                    batchRequests.push({
                        'url': '/system/userManager/group/' + groupId + '-editors.update.json',
                        'method': 'POST',
                        'parameters': {
                            ':viewer@Delete': context,
                            ':member@Delete': context
                        }
                    });
                    batchRequests.push({
                        "url": "/system/userManager/group/" + groupId + "-managers.update.json",
                        "method": "POST",
                        "parameters": {
                            ":viewer@Delete": context,
                            ":member@Delete": context
                        }
                    });
                } else {
                    parameters[':manager@Delete'] = context;
                    parameters[':editor@Delete'] = context;
                    parameters[':viewer@Delete'] = context;
                    batchRequests.push({
                        "url": "/p/" + items[i]["_path"] + ".members.json",
                        "method": "POST",
                        "parameters": parameters
                    });
                }
            }
        };

        /**
         * Remove the selected items from the current library only and keep them onto the
         * system.
         */
        var removeFromLibrary = function(){
            var batchRequests = [];
            processRemoveFromLibrary(batchRequests, contentIView);
            processRemoveFromLibrary(batchRequests, contentIManage);
            sendDeletes(batchRequests, (contextType === "collection" ? "#deletecontent_message_from_collection" : "#deletecontent_message_from_library"));
        };

        ////////////////////////////
        // Remove from the system //
        ////////////////////////////

        /**
         * Add one request for each item to delete from the system
         * @param {Object} batchRequests    Array to which to add the requests for removing the content
         * @param {Object} items            Content items to be removed from the system
         */
        var processRemoveFromSystem = function(batchRequests, items){
            batchRequests = batchRequests || [];
            for (var i = 0; i < items.length; i++){
                batchRequests.push({
                    "url": "/p/" + items[i]["_path"],
                    "method": "POST",
                    "parameters": {
                        ":operation": "delete"
                    }
                });
                // Remove the pseudoGroups associated to the collection
                var collectionGroupId = sakai.api.Content.Collections.getCollectionGroupId(items[i]);
                if (sakai.api.Content.Collections.isCollection(items[i])) {
                    batchRequests.push({
                        "url": "/system/userManager.delete.json",
                        "method": "POST",
                        "parameters": {
                            ":applyTo": [collectionGroupId, collectionGroupId + "-members", collectionGroupId + "-managers"]
                        }
                    });
                }
            }
        };

        /**
         * Remove the selected items from the system and thus from all libraries where this is being
         * used
         */
        var removeFromSystem = function(){
            // Remove content I manage from the system
            var batchRequests = [];
            processRemoveFromLibrary(batchRequests, contentIView);
            processRemoveFromSystem(batchRequests, contentIManage);
            sendDeletes(batchRequests, "#deletecontent_message_from_system");
        };

        var collectionsToUpdate = {};

        /**
         * Check whether any users or groups are either managers or viewers from
         * any of the selected content items
         */
        var checkUsedByOthers = function(){
            collectionsToUpdate = {};
            var userGroupIds = [];
            var collectionsToCheck = [];
            // Check whether any of the content I manage is managed by or
            // shared with other people
            $.each(contentIManage, function(m, contentItem) {
                if (sakai.api.Content.Collections.isCollection(contentItem)) {
                    var collectionGroupId = sakai.api.Content.Collections.getCollectionGroupId(contentItem);
                    collectionsToCheck.push(collectionGroupId + '-members');
                    collectionsToCheck.push(collectionGroupId + '-editors');
                    collectionsToCheck.push(collectionGroupId + '-managers');
                } else {
                    var managers = contentItem['sakai:pooled-content-manager'];
                    if (managers){
                        for (var i = 0; i < managers.length; i++){
                            if ($.inArray(managers[i], userGroupIds) === -1 && managers[i] !== sakai.data.me.user.userid &&
                            managers[i] !== context){
                                userGroupIds.push(managers[i]);
                            }
                        }
                    }
                    var editors = contentItem['sakai:pooled-content-editor'];
                    if (editors && editors.length) {
                        $.each(editors, function(idx, editor) {
                            if ($.inArray(editor, userGroupIds) === -1 && editor !== sakai.data.me.user.userid && editor !== context) {
                                userGroupIds.push(editor);
                            }
                        });
                    }
                    var viewers = contentItem['sakai:pooled-content-viewer'];
                    if (viewers){
                        for (var j = 0; j < viewers.length; j++){
                            if ($.inArray(viewers[j], userGroupIds) === -1 && viewers[j] !== sakai.data.me.user.userid &&
                                viewers[j] !== context && viewers[j] !== "everyone" && viewers[j] !== "anonymous"){
                                userGroupIds.push(viewers[j]);
                                if (sakai.api.Content.Collections.isCollection(viewers[j])) {
                                     collectionsToUpdate[viewers[j]] = collectionsToUpdate[viewers[j]] || 0;
                                     collectionsToUpdate[viewers[j]] += 1;
                                 }
                            }
                        }
                    }
                }
            });
            if (collectionsToCheck.length > 0) {
                var batchRequest = [];
                $.each(collectionsToCheck, function(index, collectiongroup){
                    batchRequest.push({
                        "url": "/system/userManager/group/" + collectiongroup + ".members.json",
                        "method": "GET",
                        "parameters": {
                            items: 10000
                        }
                    });
                });
                sakai.api.Server.batch(batchRequest, function (success, data) {
                    for (var i = 0; i < data.results.length; i++) {
                        var members = $.parseJSON(data.results[i].body);
                        for (var ii = 0; ii < members.length; ii++) {
                            var member = members[ii].userid || members[ii].groupid;
                            if ($.inArray(member, userGroupIds) === -1 &&
                                member !== sakai.data.me.user.userid &&
                                member !== context) {
                                userGroupIds.push(member);
                                if (sakai.api.Content.Collections.isCollection(member)) {
                                    collectionsToUpdate[member] = collectionsToUpdate[member] || 0;
                                    collectionsToUpdate[member] += 1;
                                }
                            }
                        }
                    }
                    if (userGroupIds.length > 0) {
                        setUpUsedByOverlay(userGroupIds);
                    } else {
                        removeFromSystem();
                    }
                });
            } else {
                if (userGroupIds.length > 0) {
                    setUpUsedByOverlay(userGroupIds);
                } else {
                    removeFromSystem();
                }
            }
        };

        /**
         * When the content the user is trying to delete from the system is
         * being used by others, present an overlay that lists all of the
         * groups and users that either use or manage the content
         * @param {Object} userGroupIds    Array that contains the userids and groupids of all
         *                                 users and groups using the content
         */
        var setUpUsedByOverlay = function(userGroupIds){
            // Show the overview screen of who else is using this
            $("#deletecontent_used_by_others_container").html("");
            $("#deletecontent_container").hide();
            $("#deletecontent_used_by_others").show();
            // Set up the buttons correctly
            hideButtons();
            $("#deletecontent_action_removefromsystem_confirm").show();
            if (context && contextType === "collection"){
                $("#deletecontent_action_removefromcollection_only").show();
            } else if (context){
                $("#deletecontent_action_removefromlibrary_only").show();
            }
            // Show the correct overlay title
            $("#deletecontent_main_content").hide();
            $("#deletecontent_main_confirm").show();
            // Get the profile information of who else is using it
            var batchRequests = [];
            for (var i = 0; i < userGroupIds.length; i++){
                batchRequests.push({
                    "url": "/~" + userGroupIds[i] + "/public/authprofile.profile.json",
                    "method": "GET"
                });
            }
            // Get profile information for each of the users and groups using
            // this content
            sakai.api.Server.batch(batchRequests, function (success, data) {
                var profileInfo = [];
                for (var i = 0; i < data.results.length; i++){
                    if (data.results[i].success && data.results[i].status !== 404) {
                        // Process pseudoGroups
                        var profile = $.parseJSON(data.results[i].body);
                        profile.showLink = true;
                        if (sakai.api.Content.Collections.isCollection(profile)){
                            profile.collectionid = sakai.api.Content.Collections.getCollectionPoolId(profile);
                        } else if (profile["sakai:excludeSearch"] === "true"){
                            var splitOnDash = profile.groupid.split("-");
                            profile["sakai:group-title"] = profile["sakai:parent-group-title"] + " (" + sakai.api.i18n.getValueForKey(profile["sakai:role-title-plural"]) + ")";
                            profile.groupid = splitOnDash.splice(0, splitOnDash.length - 1).join("-");
                        }
                        profileInfo.push(profile);
                    } else {
                        var privateProfile = {
                            showLink: false
                        };
                        if (data.results[i].url.substring(0,4) === '/~c-') {
                            privateProfile.collectionid = true;
                            privateProfile['sakai:group-title'] =
                                sakai.api.i18n.getValueForKey('PRIVATE_COLLECTION', 'deletecontent');
                        } else {
                            privateProfile['sakai:group-title'] =
                                sakai.api.i18n.getValueForKey('PRIVATE_USER_GROUP', 'deletecontent');
                        }
                        profileInfo.push(privateProfile);
                    }
                }
                $("#deletecontent_used_by_others_container").html(sakai.api.Util.TemplateRenderer("deletecontent_used_by_others_template", {
                    "profiles": profileInfo,
                    "sakai": sakai
                }));
            });
        };

        ////////////////////////////
        // Remove hybrid strategy //
        ////////////////////////////

        /**
         * Check whether the users has chosen to remove the content he manages from his
         * library only or from the system. If removing from the library only, we can
         * go ahead and remove the content. If removing from the system, we want to check
         * first whether the content is being used by anyone else
         */
        var selectHybrid = function(){
            var manageOption = $("input[name='deletecontent_hybrid_options']:checked").val();
            if (manageOption === "libraryonly") {
                removeFromLibrary();
            } else if (manageOption === "system") {
                checkUsedByOthers();
            }
        };

        ///////////////////
        // Overlay setup //
        ///////////////////

        /**
         * Hide all of the action buttons in the overlay
         */
        var hideButtons = function(){
            $("#deletecontent_action_removefromsystem").hide();
            $("#deletecontent_action_removefromsystem_nocontext").hide();
            $("#deletecontent_action_removefromlibrary").hide();
            $("#deletecontent_action_removefromcollection").hide();
            $("#deletecontent_action_apply").hide();
            $("#deletecontent_action_removefromsystem_confirm").hide();
            $("#deletecontent_action_removefromlibrary_only").hide();
            $("#deletecontent_action_removefromcollection_only").hide();
        };

        /**
         * Set up the delete overlay depending on the permissions I have on the content
         * about to be deleted from the overlay
         * There are 3 scenarios:
         * 1. I am a manager of some items and a viewer of others
         * 2. I am a manager of all items
         * 3. I am a viewer of all items
         * @param {Object} contentIManage    Array that contains all files about to be
         *                                   removed from the library that I manage
         * @param {Object} contentIView      Array that contains all files about to be
         *                                   removed from the library that I'm a viewer of
         */
        var setupOverlay = function(contentIManage, contentIView){
            hideButtons();
            var template = "";
            if (contentIManage.length > 0 && contentIView.length > 0){
                // Set up overlay for mixed permissions
                template = "deletecontent_template_hybrid";
                $("#deletecontent_action_apply").show();
            } else if (contentIManage.length > 0){
                // Set up overlay for full management permissions
                template = "deletecontent_template_list";
                if (context){
                    $("#deletecontent_action_removefromsystem").show();
                    if (contextType === "collection"){
                        if (sakai_global.content_profile && sakai_global.content_profile.content_data) {
                            var managerCid = 'c-' + sakai_global.content_profile.content_data.data._path;
                            collectionsToUpdate[managerCid] = collectionsToUpdate[managerCid] || 0;
                            collectionsToUpdate[managerCid] += contentIManage.length;
                        }
                        $("#deletecontent_action_removefromcollection").show();
                    } else {
                        $("#deletecontent_action_removefromlibrary").show();
                    }
                // When no context/library is specified, we assume that the content is being deleted outside
                // of a library (e.g. content profile). We thus don't offer the remove from library option
                } else {
                    $("#deletecontent_action_removefromsystem_nocontext").show();
                }
            } else if (contentIView.length > 0){
                // Set up overlay for full viewer permissions
                template = "deletecontent_template_list";
                if (contextType === "collection") {
                    if (sakai_global.content_profile && sakai_global.content_profile.content_data) {
                        var viewerCid = 'c-' + sakai_global.content_profile.content_data.data._path;
                        collectionsToUpdate[viewerCid] =
                            collectionsToUpdate[viewerCid] || 0;
                        collectionsToUpdate[viewerCid] += contentIView.length;
                    }
                    $("#deletecontent_action_removefromcollection").show();
                } else {
                    $("#deletecontent_action_removefromlibrary").show();
                }
            }
            $("#deletecontent_container").html(sakai.api.Util.TemplateRenderer(template, {
                "contentIManage": contentIManage,
                "contentIView": contentIView,
                "contextType": contextType,
                "sakai": sakai
            }));
        };

        /**
         * Run over the list of content items to delete and determine whether there
         * any that I manage and can thus remove from the system
         * @param {Object} contentList    Response from batch request that retrieved
         *                                metadata for all content that need to be deleted
         */
        var findContentIManage = function(contentList){
            contentIManage = []; 
            contentIView = [];
            $.each(contentList.results, function (i, contentItem) {
                var content = $.parseJSON(contentItem.body);
                var manage = sakai.api.Content.isUserAManager(content, sakai.data.me);
                if (manage){
                    contentIManage.push(content);
                } else {
                    contentIView.push(content);
                }
            });
            setupOverlay(contentIManage, contentIView);
        };

        /**
         * Retrieve the metadata of all selected files
         * @param {Object} paths    Array that contains the paths to all
         *                          content that needs to be deleted
         */
        var getContentInfo = function(paths){
            var batchRequest = [];
            $.each(paths, function (i, url) {
                batchRequest.push({
                    url: "/p/" + url + ".json",
                    method: "GET"
                });
            });
            sakai.api.Server.batch(batchRequest, function (success, data) {
                if (success) {
                    findContentIManage(data);
                }
            });
        };

        ////////////////////
        // Initialisation //
        ////////////////////

        /**
         * Load the delete content widget with the appropriate data
         * This function can be called from anywhere within Sakai by triggering the
         * 'init.deletecontent.sakai' event
         *
         * @param {Object} data A JSON object containing the necessary information.
         *
         * @example To delete one item:
         *     $(window).trigger('init.deletecontent.sakai', [{
         *         "path": [ "/test.jpg" ]
         *     }, callbackFn]);  // callbackFn is sent one param: success (true if delete succeeded, false otherwise)
         *
         * @example To delete multiple items:
         *     $(window).trigger('init.deletecontent.sakai', [{
         *         "path": [ "/file1.ext", "/file2.ext", "/file3.ext", "/file4.ext" ]
         *     }, callbackFn]);  // callbackFn is sent one param: success (true if delete succeeded, false otherwise)
         */
        var load = function(ev, data, _callback){
            context = data.context;
            contextType = "default";
            if (context && sakai.api.Content.Collections.isCollection(context)){
                contextType = "collection";
            }
            callback = _callback;
            pathsToDelete = data.paths;
            getContentInfo(data.paths);
            hideButtons();
            // Show the appropriate overlay title
            $("#deletecontent_main_confirm").hide();
            $("#deletecontent_main_content").show();
            // Show and clear the main container
            $("#deletecontent_container").html("");
            $("#deletecontent_container").show();
            $("#deletecontent_used_by_others").hide();
            sakai.api.Util.Modal.open($deletecontent_dialog);
        };

        /**
         * Initialize the delete content widget
         * All the functionality in here is loaded before the widget is actually rendered
         */
        var init = function(){
            // This will make the widget popup as a layover.
            sakai.api.Util.Modal.setup($deletecontent_dialog, {
                modal: true,
                toTop: true
            });
        };

        ////////////////////////////
        // Internal event binding //
        ////////////////////////////

        $("#deletecontent_action_removefromlibrary").bind("click", removeFromLibrary);
        $("#deletecontent_action_removefromcollection").bind("click", removeFromLibrary);
        $("#deletecontent_action_removefromsystem").bind("click", checkUsedByOthers);
        $("#deletecontent_action_apply").bind("click", selectHybrid);
        $("#deletecontent_action_removefromlibrary_only").bind("click", removeFromLibrary);
        $("#deletecontent_action_removefromcollection_only").bind("click", removeFromLibrary);
        $("#deletecontent_action_removefromsystem_confirm").bind("click", removeFromSystem);
        $("#deletecontent_action_removefromsystem_nocontext").bind("click", checkUsedByOthers);

        ////////////////////////////
        // External event binding //
        ////////////////////////////

        $(window).unbind("init.deletecontent.sakai").bind("init.deletecontent.sakai", load);

        init();
    };
    
    
    sakai_global.entity = function(tuid, showSettings){

        /////////////////////////////
        // CONFIGURATION VARIABLES //
        /////////////////////////////

        var $rootel = $("#" + tuid);
        var renderObj = {};

        // Containers
        var entityContainer = "#entity_container";
        var entityUserPictureDropdown = ".entity_user_picture_dropdown";
        var entityUserCreateAddDropdown = ".entity_user_create_add_dropdown";

        // Buttons
        var entityUserCreateAndAdd = "#entity_user_create_and_add";
        var entityChangeImage = ".entity_change_avatar";
        var entityUserMessage = "#entity_user_message";
        var entityUserAddToContacts = "#entity_user_add_to_contacts";
        var entityUserDropdown = "#entity_user_image.s3d-dropdown-menu";
        var entityGroupDropdown = "#entity_group_image.s3d-dropdown-menu";

        /**
         * Filters out pseudogroups and adds the parent group to the list to be displayed
         * @param {Array} data required array of user and group objects to filter
         * @param {Boolean} setCount required Set to true if the context is content and the counts should be updated (Filtered pseudogroups don't count)
         * @param {Object} context not required if setCount is false, provides the context of the entity widget and holds the counts
         * @Return {Object} parentGroups Object containing the parent groups to display
         */
        var getParentGroups = function(data, setCount, context){
            var parentGroups = {};
            if (setCount) {
                context.data.members.counts.groups = 0;
                context.data.members.counts.collections = 0;
            }
            $.each(data, function(index, group){
                // Check for pseudogroups, if a pseudogroup filter out the parent
                if (group.pseudoGroup) {
                    // Only groups should be added to the object
                    if (!parentGroups.hasOwnProperty(group.parent["sakai:group-id"]) && group.parent["sakai:group-id"]) {
                        if (setCount) {
                            context.data.members.counts.groups++;
                        }
                        // Discard pseudogroup but store parent group
                        parentGroups[group.parent["sakai:group-id"]] = {
                            "sakai:group-id": group.parent["sakai:group-id"],
                            "sakai:group-title": group.parent["sakai:group-title"]
                        };
                    }
                // If no pseudogroup store the group as it is
                } else if (!parentGroups.hasOwnProperty(group["sakai:group-id"]) && group["sakai:group-id"]) {
                    if (setCount) {
                        if (sakai.api.Content.Collections.isCollection(group)){
                            context.data.members.counts.collections++;
                        } else {
                            context.data.members.counts.groups++;
                        }
                    }
                    parentGroups[group["sakai:group-id"]] = group;
                }
            });
            return parentGroups;
        };

        /**
         * Saves the content/collection name
         * @param {String} newTitle The new content/collection title to save
         */
        var saveName = function(newTitle) {
            var oldTitle = $.trim($('#entity_name').attr('data-original-title'));
            $('#entity_name').attr('data-original-title', newTitle);
            if (newTitle && newTitle !== oldTitle) {
                $.ajax({
                    url: '/p/' + sakai_global.content_profile.content_data.data['_path'] + '.html',
                    type: 'POST',
                    cache: false,
                    data: {
                        'sakai:pooled-content-file-name': newTitle
                    },
                    success: function() {
                        var contentData = sakai_global.content_profile.content_data.data;
                        if (sakai.api.Content.Collections.isCollection(contentData)) {
                            // Change the group title as well
                            var groupId = sakai.api.Content.Collections.getCollectionGroupId(contentData);
                            $.ajax({
                                'url': '/system/userManager/group/' + groupId + '.update.json',
                                'type': 'POST',
                                'data': {
                                    'sakai:group-title': newTitle
                                },
                                'success': function() {
                                    // Update the me object
                                    var memberships = sakai.api.Groups.getMemberships(sakai.data.me.groups, true);
                                    $.each(memberships.entry, function(index, membership) {
                                        if (membership['sakai:group-id'] === groupId) {
                                            membership['sakai:group-title'] = newTitle;
                                        }
                                    });
                                    finishChangeTitle(newTitle);
                                }
                            });
                        } else {
                            finishChangeTitle(newTitle);
                        }
                    }
                });
            }
        };

        var finishChangeTitle = function(newTitle) {
            var title = newTitle;
            var link;
            sakai_global.content_profile.content_data.data['sakai:pooled-content-file-name'] = title;
            // Export as IMS Package
            if (sakai.api.Content.getMimeType(sakai_global.content_profile.content_data.data) === 'x-sakai/document') {
                link = '/imscp/' + sakai_global.content_profile.content_data.data['_path'] + '/' +
                sakai.api.Util.safeURL(sakai_global.content_profile.content_data.data['sakai:pooled-content-file-name']) + '.zip';
                $('#contentpreview_download_button').attr('href', link);
            // Download as a normal file
            } else {
                link = sakai_global.content_profile.content_data.smallPath + '/' +
                sakai.api.Util.safeURL(sakai_global.content_profile.content_data.data['sakai:pooled-content-file-name']);
                $('#contentpreview_download_button').attr('href', link);
            }
            document.title = sakai.api.i18n.getValueForKey(sakai.config.PageTitles.prefix) + " " + title;
        };

        /**
         * Get the complete user list
         * This includes managers, viewers and editors
         * @return {Array} All the users for a specific content item
         */
        var getUserList = function() {
            return sakai_global.content_profile.content_data.members.managers.concat(
                sakai_global.content_profile.content_data.members.viewers,
                sakai_global.content_profile.content_data.members.editors
            );
        };

        var addBindingUsedBy = function(context) {
            var $entityContentUsersDialog = $('#entity_content_users_dialog');
            var $entityContentUsersDialogContainer = $('#entity_content_users_dialog_list_container');
            var entityContentUsersDialogTemplate = '#entity_content_users_dialog_list_template';
            var entityContentCollectionsDialogTemplate = '#entity_content_collections_dialog_list_template';

            $entityContentUsersDialog.jqm({
                modal: true,
                overlay: 20,
                toTop: true
            });

            $('.entity_content_people').on('click', function() {
                var userList = getUserList();

                $entityContentUsersDialog.jqmShow();

                var json = {
                    'userList': userList,
                    'type': 'people',
                    'sakai': sakai
                };

                // render dialog template
                sakai.api.Util.TemplateRenderer(entityContentUsersDialogTemplate, json, $entityContentUsersDialogContainer);
                $('#entity_content_users_dialog_heading').html($('#entity_content_people').html());

                return false;
            });

            $('.entity_content_group').on('click', function() {
                var userList = getUserList();

                $entityContentUsersDialog.jqmShow();

                var parentGroups = getParentGroups(userList, false);

                var json = {
                    'userList': parentGroups,
                    'type': 'groups',
                    'sakai': sakai
                };

                // render users dialog template
                sakai.api.Util.TemplateRenderer(entityContentUsersDialogTemplate, json, $entityContentUsersDialogContainer);
                $entityContentUsersDialogContainer.show();
                $('#entity_content_users_dialog_heading').html($('#entity_content_groups').html());

                return false;
            });

            $('.entity_content_collections').on('click', function() {
                var userList = getUserList();

                $entityContentUsersDialog.jqmShow();

                var json = {
                    'userList': userList,
                    'sakai': sakai
                };

                // render users dialog template
                sakai.api.Util.TemplateRenderer(entityContentCollectionsDialogTemplate, json, $entityContentUsersDialogContainer);
                $entityContentUsersDialogContainer.show();
                $('#entity_content_users_dialog_heading').html($('#entity_content_collections').html());

                return false;
            });

            $('#entity_contentsettings_dropdown').html(sakai.api.Util.TemplateRenderer('entity_contentsettings_dropdown', context));

            $('#entity_comments_link').on('click', function() {
                $('html:not(:animated), body:not(:animated)').animate({
                    scrollTop: $('#content_profile_right_metacomments #contentcomments_mainContainer').offset().top
                }, 500);
                $('#content_profile_right_metacomments #contentcomments_txtMessage').focus();
            });
        };

        /**
         * The 'context' variable can have the following values:
         * - 'user_me' When the viewed user page is the current logged in user
         * - 'user_other' When the viewed user page is a user that is not a contact
         * - 'contact' When the viewed user page is one of a contact
         * @param {String} context String defining the context of the entity widget
         */
        var addBinding = function(context){
            switch(context.type){
                case "user_me":
                    $(entityUserCreateAndAdd).bind("click", function(){
                        if($(this).hasClass("entity_user_created_add_clicked")){
                            $(this).removeClass("entity_user_created_add_clicked");
                            $(entityUserCreateAddDropdown).hide();
                        }else{
                            $(this).addClass("entity_user_created_add_clicked");
                            $(entityUserCreateAddDropdown).show();
                            $(entityUserCreateAddDropdown).css("left", $(this).position().left - 38);
                        }
                    });
                    $(entityUserDropdown).hover(function(){
                        var $li = $(this);
                        var $subnav = $li.children(".s3d-dropdown-container");

                        var pos = $li.position();
                        $subnav.css("left", pos.left + 15);
                        $subnav.css("margin-top", $li.height() + 4 + "px");
                        $subnav.show();
                    }, function(){
                        var $li = $(this);
                        $li.children(".s3d-dropdown-container").hide();
                    });
                    $(window).bind("displayName.profile.updated.sakai", function(){
                        $('.entity_name_me').text(sakai.api.User.getDisplayName(sakai.data.me.profile));
                    });
                    break;
                case "user_other":
                    $(entityUserMessage).bind("click", function(){
                        // Place message functionality
                    });
                    $(entityUserAddToContacts).bind("click", function(){
                        // Place contacts functionality
                    });
                    break;
                case "contact":
                    $(entityUserMessage).bind("click", function(){
                        // Place message functionality
                    });
                    break;
                case "group_managed":
                    checkHash(context);
                    var json = {
                        "joinable": context.data.authprofile["sakai:group-joinable"] === "withauth",
                        "context": context,
                        "sakai": sakai
                    };

                    $('#entity_groupsettings_dropdown').html(sakai.api.Util.TemplateRenderer("entity_groupsettings_dropdown", json));

                    $('#ew_group_settings_edit_link').live("click", function(ev) {
                        $(window).trigger("init.worldsettings.sakai", context.data.authprofile['sakai:group-id']);
                        $('#entity_groupsettings_dropdown').jqmHide();
                    });

                    $('#ew_group_delete_link').live("click", function(ev) {
                        $(window).trigger('init.deletegroup.sakai', [context.data.authprofile,
                            function (success) {
                                if (success) {
                                    // Wait for 2 seconds
                                    setTimeout(function () {
                                        // Relocate to the my sakai page
                                        document.location = "/me";
                                    }, 2000);
                                }
                            }]
                        );
                        $('#entity_groupsettings_dropdown').jqmHide();
                    });

                    $('#ew_group_join_requests_link').live("click", function(ev) {
                        $(window).trigger("init.joinrequests.sakai", context.data.authprofile);
                        $('#entity_groupsettings_dropdown').jqmHide();
                    });

                    $(".sakai_add_content_overlay").live("click", function(ev){
                        $('#entity_groupsettings_dropdown').jqmHide();
                    });

                    $(entityGroupDropdown).hover(function(){
                        var $li = $(this);
                        var $subnav = $li.children(".s3d-dropdown-container");

                        var pos = $li.position();
                        $subnav.css("left", pos.left + 5);
                        $subnav.css("margin-top", $li.height() + 4 + "px");
                        $subnav.show();
                    }, function(){
                        var $li = $(this);
                        $li.children(".s3d-dropdown-container").hide();
                    });
                    $(window).trigger("setData.changepic.sakai", ["group", context.data.authprofile["sakai:group-id"]]);
                    $(window).bind("ready.changepic.sakai", function(){
                        $(window).trigger("setData.changepic.sakai", ["group", context.data.authprofile["sakai:group-id"]]);
                    });
                    sakai.api.Widgets.widgetLoader.insertWidgets("entity_groupsettings_dropdown", false, $rootel);
                    break;
                case "group":
                    $(window).bind("ready.joinrequestbuttons.sakai", function() {
                        sakai.api.Groups.getMembers(context.data.authprofile["sakai:group-id"], function(success, members) {
                            members = members[context.data.authprofile["sakai:group-id"]];
                            var managerCount = sakai.api.Groups.getManagerCount(context.data.authprofile, members);
                            var leaveAllowed = managerCount > 1 || !sakai.api.Groups.isCurrentUserAManager(context.data.authprofile["sakai:group-id"], sakai.data.me);
                            $(window).trigger("init.joinrequestbuttons.sakai", [
                                {
                                    "groupProfile": context.data.authprofile,
                                    "groupMembers": members,
                                    "leaveAllowed": leaveAllowed
                                },
                                context.data.authprofile["sakai:group-id"],
                                context.data.authprofile["sakai:group-joinable"],
                                managerCount,
                                "s3d-header-button",
                                function (renderedButtons) {
                                    // onShow
                                    $("#joinrequestbuttons_widget", $rootel).show();
                                }
                            ]);
                        }, true);
                    });
                    sakai.api.Widgets.widgetLoader.insertWidgets("entity_container", false, $rootel);
                    break;
                case "content_anon": //fallthrough
                case "content_not_shared": //fallthrough
                case "content_shared": //fallthrough
                case 'content_edited':
                    addBindingUsedBy(context);
                    break;
                case "content_managed":
                    var entityNameEditable = "#entity_name.entity_name_editable";

                    $(entityNameEditable).click(function(e) {
                        if (!$(this).find('input').length) {
                            $(this).addClass('entity_name_editing');
                            $(this).text($.trim($('#entity_name').attr('data-original-title')));
                            $(this).trigger('openjedit.entity.sakai');
                            $(window).trigger('position.inserter.sakai');
                        }
                    });
                    // setup jeditable for the content name field
                    var nameUpdate = function(value, settings) {
                        $(this).removeClass('entity_name_editing');
                        saveName($.trim(value));
                        return value;
                    };
                    var nameCallback = function(value, settings) {
                        var newDottedTitle = sakai.api.Util.applyThreeDots($.trim(value), 800, {
                            whole_word: false
                        }, '', true);
                        $(this).html(newDottedTitle);
                        $(window).trigger('position.inserter.sakai');
                    };
                    $(entityNameEditable).editable(nameUpdate, {
                        type: 'text',
                        onblur: 'submit',
                        event: 'openjedit.entity.sakai',
                        callback: nameCallback
                    });
                    addBindingUsedBy(context);
                    break;
            }
       };

        var prepareRenderContext = function(context) {
            if (context.context === "content") {
                if ($.isArray(sakai_global.content_profile.content_data.members.managers)) {
                    getParentGroups(getUserList, true, context);
                }

                // Collaborators are managers & editors
                var collaborators = sakai_global.content_profile.content_data.members.managers.concat(
                    sakai_global.content_profile.content_data.members.editors
                );

                sakai_global.content_profile.content_data.members.counts.collaboratorgroups = 0;
                sakai_global.content_profile.content_data.members.counts.collaboratorusers = 0;
                $.each(collaborators, function(i, collaborator) {
                    if(collaborator['sakai:group-id']){
                        sakai_global.content_profile.content_data.members.counts.collaboratorgroups++;
                    } else {
                        sakai_global.content_profile.content_data.members.counts.collaboratorusers++;
                    }
                });

                sakai_global.content_profile.content_data.members.counts.viewergroups = 0;
                sakai_global.content_profile.content_data.members.counts.viewerusers = 0;
                sakai_global.content_profile.content_data.members.counts.viewercollections = 0;
                $.each(sakai_global.content_profile.content_data.members.viewers, function(i, viewer){
                    if(viewer["sakai:group-id"] && sakai.api.Content.Collections.isCollection(viewer)){
                        sakai_global.content_profile.content_data.members.counts.viewercollections++;
                    } else if(viewer["sakai:group-id"]){
                        sakai_global.content_profile.content_data.members.counts.viewergroups++;
                    } else {
                        sakai_global.content_profile.content_data.members.counts.viewerusers++;
                    }
                });
            }
            context.sakai = sakai;
            context.entitymacros = sakai.api.Util.processLocalMacros($("#entity_macros_template"));
        };

        var renderEntity = function(context){
            prepareRenderContext(context);
            $(entityContainer).html(sakai.api.Util.TemplateRenderer("entity_" + context.context + "_template", context));
        };

        var toggleDropdownList = function(){
            $(entityChangeImage).nextAll(".s3d-dropdown-list").toggle();
            $(entityChangeImage).toggleClass("clicked");
            $(entityChangeImage).nextAll(".s3d-dropdown-list").css("top", $(".entity_profile_picture_down_arrow").position().top + 62);
        };

        var checkHash = function(context){
            if ($.bbq.getState("e") === "joinrequests" && context.context === "group" && context.data.authprofile["sakai:group-joinable"] === "withauth"){
                $(window).bind("ready.joinrequests.sakai", function(){
                    $(window).trigger("init.joinrequests.sakai", context.data.authprofile);
                });
                $(window).trigger("init.joinrequests.sakai", context.data.authprofile);
            }
        };

        var setupCountAreaBindings = function() {
            $('#entity_content_permissions').unbind("click").bind("click", function(){
                var $this = $(this);
                if ($("#entity_contentsettings_dropdown").is(":visible")) {
                    $('#entity_contentsettings_dropdown').jqmHide();
                } else {
                    $('#entity_contentsettings_dropdown').css({
                        'top': $this.offset().top + $this.height() + 5,
                        'left': $this.offset().left + $this.width() / 2 - 138
                    }).jqmShow();
                }
            });

            $('.ew_permissions').unbind("click").bind("click", function(e){
                e.preventDefault();
                if($(this).parents(".s3d-dropdown-list").length || $(e.target).hasClass("s3d-dropdown-list-arrow-up")){
                    $(window).trigger("init.contentpermissions.sakai", {"newPermission": $(this).data("permissionvalue") || false});
                    $('#entity_contentsettings_dropdown').jqmHide();
                }
            });

        };

        $(window).bind("sakai.entity.init", function(ev, context, type, data){
            if(data && data.data && data.data["sakai:pooled-content-file-name"]){
                data.data["sakai:pooled-content-file-name-shorter"] = sakai.api.Util.applyThreeDots(data.data["sakai:pooled-content-file-name"], 800, {
                    whole_word: false
                }, "");
            }
            renderObj = {
                "context": context,
                "type": type,
                "anon": sakai.data.me.user.anon || false,
                "data": data || {}
            };
            renderEntity(renderObj);
            addBinding(renderObj);
            $('#entity_contentsettings_dropdown').jqm({
                modal: false,
                overlay: 0,
                toTop: true,
                zIndex: 3000
            });

            $('#entity_groupsettings_dropdown').jqm({
                modal: false,
                overlay: 0,
                toTop: true,
                zIndex: 3000
            });

            setupCountAreaBindings();

            $(window).bind("updateParticipantCount.entity.sakai", function(ev, val){
                var num = parseInt($("#entity_participants_count").text(), 10);
                var newNum = num + val;
                $("#entity_participants_count").text(newNum);
                if (newNum === 1) {
                    $("#entity_participants_text").text(sakai.api.i18n.getValueForKey("PARTICIPANT", "entity"));
                } else {
                    $("#entity_participants_text").text(sakai.api.i18n.getValueForKey("PARTICIPANTS", "entity"));
                }
            });

            $("#entity_group_permissions").click(function(){
                var $this = $(this);
                if ($("#entity_groupsettings_dropdown").is(":visible")) {
                    $('#entity_groupsettings_dropdown').jqmHide();
                } else {
                    $('#entity_groupsettings_dropdown').css({
                        'top': $this.offset().top + $this.height() + 5,
                        'left': $this.offset().left + $this.width() / 2 - 138
                    }).jqmShow();
                }
            });

            sakai.api.Util.hideOnClickOut("#entity_groupsettings_dropdown", "#entity_group_permissions,.entity_permissions_icon", function(){
                $("#entity_groupsettings_dropdown").jqmHide();
            });

            sakai.api.Util.hideOnClickOut("#entity_contentsettings_dropdown", "#entity_content_permissions, .entity_permissions_icon", function(){
                $("#entity_contentsettings_dropdown").jqmHide();
            });
            
             // templateGenerator
            $('#ew_group_export_as_template_link').click(function(e){
                $(window).trigger("init.templategenerator.sakai");
                $('#entity_groupsettings_dropdown').jqmHide();
            });

            $('#ew_upload').click(function(e){
                e.preventDefault();
                $(window).trigger("init.uploadnewversion.sakai");
                $('#entity_contentsettings_dropdown').jqmHide();
            });

            $("#ew_revhistory").click(function(e){
                $(window).trigger("init.versions.sakai", {
                    pageSavePath: sakai_global.content_profile.content_data.content_path,
                    saveRef: "",
                    showByDefault: true
                });
                $('#content_profile_preview_versions_container').toggle();
                $('#entity_contentsettings_dropdown').jqmHide();
            });

            $("#ew_content_preview_delete").bind("click", function(e){
                e.preventDefault();
                window.scrollTo(0,0);
                $(window).trigger('init.deletecontent.sakai', [{
                        "paths": [sakai_global.content_profile.content_data.data._path]
                    },
                    function (success) {
                        if (success) {
                            // Wait for 2 seconds
                            setTimeout(function () {
                                // Relocate to the my sakai page
                                document.location = "/me";
                            }, 2000);
                        }
                    }]
                );
                $('#entity_contentsettings_dropdown').jqmHide();
            });

            $(".addpeople_init").live("click", function(){
                $(window).trigger("init.addpeople.sakai", [tuid, true]);
                $("#entity_groupsettings_dropdown").jqmHide();
            });

            $(".entity_owns_actions_container .ew_permissions").live("hover", function(){
                var $dropdown = $(this).find(".s3d-dropdown-list");
                $dropdown.css("left", $(this).position().left - $dropdown.width() / 2 - 30 );
                $dropdown.css("margin-top", $(this).height() + 7 + "px");
            });

            $(entityChangeImage).click(toggleDropdownList);

            sakai.api.Util.hideOnClickOut('.entity_user_avatar_menu.s3d-dropdown-list,.entity_group_avatar_menu.s3d-dropdown-list', entityChangeImage, toggleDropdownList);

        });

        // An event to call from the worldsettings dialog so that we can
        // refresh the title if it's been saved.
        $(window).bind('updatedTitle.worldsettings.sakai', function(e, title) {
            $('#entity_name').html(sakai.api.Security.safeOutput(title));
        });

        $(window).bind("sakai.entity.updatecountcache", function(e, data){
            if(data.increment){
                $("#entity_comments_link > span").text(parseInt($("#entity_comments_link > span").text(), 10) + 1);
            } else{
                $("#entity_comments_link > span").text(parseInt($("#entity_comments_link > span").text(), 10) - 1);
            }
        });

        $(window).bind("sakai.entity.updateOwnCounts", function(e) {
           if (renderObj.data.content_path) {
                sakai.api.Content.loadFullProfile([renderObj.data.content_path], function(success,data){
                    if (success){
                        sakai.api.Content.parseFullProfile(data.results, function(parsedData){
                            if (parsedData){
                                parsedData.mode = "content";
                                renderObj.data = parsedData;
                                sakai_global.content_profile.content_data = parsedData;
                                prepareRenderContext(renderObj);
                                $("#entity_owns").html(sakai.api.Util.TemplateRenderer("entity_counts_template", renderObj));
                                setupCountAreaBindings();
                            }
                        });
                    }
                });
            }
        });

        $(window).trigger("sakai.entity.ready");

    };
    
    
    
    sakai_global.inserter = function (tuid, showSettings) {


        /////////////////////////////
        // Configuration variables //
        /////////////////////////////

        var $rootel = $('#' + tuid);
        var hasInitialised = false;
        var libraryData = [];
        var library = false;
        var infinityContentScroll = false;
        var infinityCollectionScroll = false;
        var contentListDisplayed = [];
        var prevQ = '';
        var inCollection = false;
        var filesToUpload = [];
        var focusCreateNew = false;
        var contentToAdd = [];
        var topMargin = sakai.config.enableBranding ? $('.branding_widget').height() + 50 : 50;
        var $dropTarget = false;
        var numberOfItemsDropped = 0;
        var itemsDropped = [];
        widgetPos = {
            'left': 15,
            'top': topMargin
        };

        // UI Elements
        var inserterToggle = '.inserter_toggle';
        var inserterCollectionContentSearch = '#inserter_collection_content_search';
        var $inserterMimetypeFilter = $('#inserter_mimetype_filter', $rootel);
        var inserterCreateCollectionInput = '#inserter_create_collection_input';
        var topnavToggle = '#topnavigation_container .inserter_toggle';
        var inserterAllCollectionsButton = '#inserter_all_collections_button';
        var inserterMimetypeFilter = '#inserter_mimetype_filter';

        // Containers
        var $inserterWidget = $('.inserter_widget', $rootel);
        var $inserterHeader = $('#inserter_header', $rootel);
        var $inserterHeaderTitleContainer = $('#inserter_header_title_container', $rootel);
        var $inserterInitContainer = $('#inserter_init_container', $rootel);
        var $inserterCollectionInfiniteScrollContainer = $('#inserter_collection_infinitescroll_container', $rootel);
        var $inserterCollectionInfiniteScrollContainerList = '#inserter_collection_infinitescroll_container ul';
        var $inserterCollectionContentContainer = $('#inserter_collection_content_container', $rootel);
        var $inserterCollectionItemsList = $('.inserter_collections_top_container ul', $rootel);
        var $inserterCollectionItemsListItem = $('.inserter_collections_top_container ul li', $rootel);
        var $inserterContentInfiniteScrollContainerList = $('#inserter_content_infinitescroll_container ul', $rootel);
        var $inserterContentInfiniteScrollContainer = $('#inserter_content_infinitescroll_container', $rootel);
        var $inserterNoResultsContainer = $('#inserter_no_results_container', $rootel);

        // Templates
        var inserterHeaderTemplate = 'inserter_header_title_template';
        var inserterInitTemplate = 'inserter_init_template';
        var inserterCollectionContentTemplate = 'inserter_collection_content_template';
        var inserterNoResultsTemplate = 'inserter_no_results_template';


        ///////////////////////
        // Utility functions //
        ///////////////////////

        /**
         * Opens/closes the inserter
         */
        var toggleInserter = function() {
            $inserterWidget.fadeToggle(250);
            $(topnavToggle).toggleClass('inserter_toggle_active');
            if (!hasInitialised) {
                doInit();
                hasInitialised = true;
            } else if (focusCreateNew) {
                $(inserterCreateCollectionInput).focus();
            }
            refreshWidget();
        };

        /**
         * Search through the list based on the title of the document
         * @param {Object} ev Event object from search input field keyup action
         */
        var searchCollection = function(ev) {
            if ((ev.keyCode === $.ui.keyCode.ENTER || $(ev.target).hasClass('s3d-search-button')) && prevQ !== $.trim($(inserterCollectionContentSearch, $rootel).val())) {
                prevQ = $.trim($(inserterCollectionContentSearch, $rootel).val());
                showCollection(contentListDisplayed);
            }
        };

        /**
         * Disables/Enables the header input and select elements
         * @param {Boolean} disable True or false depending on if the search should be enabled or not
         */
        var disableEnableHeader = function(disable) {
            if (disable) {
                $(inserterCollectionContentSearch, $rootel).attr('disabled', 'true');
                $(inserterCollectionContentSearch).next().attr('disabled', 'true');
                $inserterMimetypeFilter.attr('disabled', 'true');
            } else {
                $(inserterCollectionContentSearch, $rootel).removeAttr('disabled');
                $(inserterCollectionContentSearch).next().removeAttr('disabled');
                $inserterMimetypeFilter.removeAttr('disabled');
            }
        };

        /**
         * Renders the header for each context
         * @param {String} context if context is 'library' the library header will be rendered, other header has collection title.
         * @param {Object} item Object containing the data of the collection to be shown
         */
        var renderHeader = function(context, item) {
            sakai.data.me.user.properties.contentCount = sakai.data.me.user.properties.contentCount || 0;
            $inserterHeaderTitleContainer.css('opacity', 0);
            sakai.api.Util.TemplateRenderer(inserterHeaderTemplate, {
                'context': context,
                'item': item,
                'librarycount': sakai.data.me.user.properties.contentCount,
                'sakai': sakai
            }, $inserterHeaderTitleContainer);
            $inserterHeaderTitleContainer.animate({
                'opacity': 1
            }, 400);
        };

        /**
         * Kills off the infinite scroll instances on the page
         */
        var killInfiniteScroll = function() {
            if (infinityContentScroll) {
                infinityContentScroll.kill();
                infinityContentScroll = false;
            }
            if (infinityCollectionScroll) {
                infinityCollectionScroll.kill();
                infinityCollectionScroll = false;
            }
        };

        /**
         * Reset the UI to the initial state
         */
        var refreshWidget = function() {
            killInfiniteScroll();
            inCollection = false;
            disableEnableHeader(false);
            renderHeader('init');
            library = false;
            $(inserterCollectionContentSearch, $rootel).val('');
            $inserterMimetypeFilter.val($('options:first', $inserterMimetypeFilter).val());
            animateUIElements('reset');
            doInit();
        };

        /**
         * Animate different UI elements according to the context of the widget
         * @param {String} context Context the widget is in
         */
        var animateUIElements = function(context) {
            switch (context) {
                case 'reset':
                    $inserterCollectionContentContainer.animate({
                        'opacity': 0
                    }, 400, function() {
                        $inserterCollectionContentContainer.hide();
                        $inserterInitContainer.show();
                        $inserterInitContainer.animate({
                            'opacity': 1
                        }, 400);
                    });
                    break;
                case 'results':
                    $inserterInitContainer.animate({
                        'opacity': 0
                    }, 400, function() {
                        $inserterInitContainer.hide();
                        $inserterCollectionContentContainer.show();
                        $inserterCollectionContentContainer.animate({
                            'opacity': 1
                        }, 400);
                    });
                    break;
            }
        };

        /**
         * Process library item results from the server
         * @param {Object} results Results fetched by the infinite scroller
         * @param {Function} callback callback executed in the infinite scroller
         */
        var handleLibraryItems = function (results, callback) {
            sakai.api.Content.prepareContentForRender(results, sakai.data.me, function(contentResults) {
                $.each(sakai.data.me.groups, function(index, group) {
                    $.each(contentResults, function(i, item) {
                        if (group['sakai:category'] === 'collection' && group.groupid === 'c-' + item._path) {
                            item.counts = {
                                contentCount: group.counts.contentCount
                            };
                            libraryData.push(item);
                        }
                    });
                });
                callback(contentResults);
            });
        };

        /**
         * Reduces the count of items in the library, depends on amount of deleted items
         * @param {Object} ev Event sent out by the deletecontent widget after deletion of content is completed
         * @param {Array} deletedContent Array of IDs that were deleted from the library
         */
        var removeFromLibraryCount = function(ev, deletedContent) {
            sakai.data.me.user.properties.contentCount -= deletedContent.length;
            var $libraryCountEl = $('#inserter_init_container ul li[data-collection-id="library"] .inserter_item_count_container', $rootel);
            $libraryCountEl.text(sakai.data.me.user.properties.contentCount);
        };

        var updateCollectionCount = function(e, collectionId, count) {
            var $collectionCountEl = $('#inserter_init_container ul li[data-collection-id="' + collectionId + '"] .inserter_item_count_container', $rootel);
            $collectionCountEl.text(count);
        };

        /**
         * Adds to the count of items in the collection's library
         * @param {String} collectionId The id of the collection to increase the count of (cached variable)
         * @param {int} amount Total amount of dropped items to add to the count
         * @param {Boolean} inLibrary Indicates if the dropped content is already in the personal library
         */
        var addToCollectionCount = function(collectionId, amount, inLibrary) {
            // If no content was uploaded previously, initialize contentCount variable
            sakai.data.me.user.properties.contentCount = sakai.data.me.user.properties.contentCount || 0;

            // If content was not in library yet, update counts for the library
            if (!inLibrary) {
                sakai.data.me.user.properties.contentCount += amount;
                // Display library the counts in the UI
                var $libraryCountEl = $('#inserter_init_container ul li[data-collection-id="library"] .inserter_item_count_container', $rootel);
                $libraryCountEl.text(sakai.data.me.user.properties.contentCount);
                // Update the left hand nav library count
                $(window).trigger('lhnav.updateCount', ['library', sakai.data.me.user.properties.contentCount, false]);
            }

            // We need to update collection variables if that is where it was dropped
            if (collectionId !== 'library' && sakai.data.me.user.userid !== collectionId) {
                $.each(sakai.data.me.groups, function(index, group) {
                    if (group['sakai:category'] === 'collection' && group.groupid === 'c-' + collectionId) {
                        // Display the collection counts in the UI
                        updateCollectionCount(false, collectionId, group.counts.contentCount);
                        // Update the header of a collection if necessary
                        if (inCollection) {
                            $('#inserter_header_itemcount > #inserter_header_itemcount_count', $rootel).text(
                                group.counts.contentCount);
                        }
                        $.each(libraryData, function(i, item) {
                            if (item._path === collectionId) {
                                item.counts.contentCount = group.counts.contentCount;
                            }
                        });
                    }
                });
            } else {
                var currentCount = parseInt($('#inserter_header_itemcount > #inserter_header_itemcount_count', $rootel).text(), 10);
                // Update the header of the library if necessary
                if (inCollection) {
                    $('#inserter_header_itemcount > #inserter_header_itemcount_count', $rootel).text(
                        currentCount + amount);
                }
            }
        };

        /**
         * Creates a new, empty, collections with the given name and opens it in the inserter
         * @param {String} title Title to give to the new collection
         */
        var createNewCollection = function(title) {
            sakai.api.Util.progressIndicator.showProgressIndicator(sakai.api.i18n.getValueForKey('CREATING_YOUR_COLLECTION', 'inserter'), sakai.api.i18n.getValueForKey('WONT_BE_LONG', 'inserter'));
            title = title || sakai.api.i18n.getValueForKey('UNTITLED_COLLECTION', 'inserter');
            var permissions = sakai.config.Permissions.Collections.defaultaccess;
            sakai.api.Content.Collections.createCollection(title, '', permissions, [], contentToAdd, [], function(success, path) {
                sakai.api.Server.loadJSON('/p/' + path + '.json', function(success, collection) {
                    if (success) {
                        $(window).trigger('done.newaddcontent.sakai', [[collection], 'user']);
                    }
                });
                contentToAdd = [];
                $(window).trigger('sakai.collections.created');
                sakai.api.Util.progressIndicator.hideProgressIndicator();
                sakai.api.Util.notification.show(sakai.api.i18n.getValueForKey('COLLECTION_CREATED'), sakai.api.i18n.getValueForKey('COLLECTION_CREATED_LONG'));
                $(inserterCreateCollectionInput, $rootel).val('');
                $(window).trigger('sakai.mylibrary.createdCollections', {
                    items: ['newcollection']
                });
                addToCollectionCount('library', 1, false);
            });
        };

        /**
         * Adds validation to the form that creates a new collection
         */
        var validateNewCollectionForm = function() {
            var validateOpts = {
                messages: {
                    inserter_create_collection_input: {
                        required: sakai.api.i18n.getValueForKey('PROVIDE_A_TITLE_FOR_THE_NEW_COLLECTION', 'inserter')
                    }
                },
                submitHandler: function(form, validator) {
                    createNewCollection($.trim($(inserterCreateCollectionInput, $rootel).val()));
                    return false;
                }
            };
            sakai.api.Util.Forms.validate($('#inserter_create_collection_form', $rootel), validateOpts, false);
        };

        /**
         * Executed when a collection is clicked in the list
         * Shows that collection (library or other collection)
         * @param {Object} ev Click event generated by clicking a collection list item
         */
        var collectionClicked = function(ev) {
            if (!inCollection) {
                animateUIElements('results');
                var idToShow = $(this).attr('data-collection-id');
                if (idToShow === 'library') {
                    renderHeader('items', idToShow);
                    showCollection(idToShow);
                } else {
                    $.each(libraryData, function(i, item) {
                        if (item._path === idToShow) {
                            renderHeader('items', item);
                            showCollection(item);
                        }
                    });
                }
            }
        };


        ////////////////////////////
        // Drag and drop handling //
        ////////////////////////////

        /**
         * Add a batch of dropped items to a given collection
         * @param {String} collectionId ID of the collection to add the items to
         * @param {Array} collectedCollections Array of collected collection IDs
         * @param {Array} collectedContent Array of collected content IDs
         */
        var addDroppedToIndependentCollection = function(collectionId, collectedCollections, collectedContent) {
            // Add dropped content to the collection
            sakai.api.Content.Collections.addToCollection(collectionId, collectedContent, function() {
                // Share the collections that were dropped
                sakai.api.Content.Collections.shareCollection(collectedCollections,
                    sakai.api.Content.Collections.getCollectionGroupId(collectionId), false, function() {
                    addToCollectionCount(collectionId, 0, true);
                    sakai.api.Util.progressIndicator.hideProgressIndicator();
                    if (inCollection) {
                        $.each(sakai.data.me.groups, function(index, item) {
                            if (item['sakai:category'] === 'collection' &&
                                !item['sakai:pseudoGroup'] &&
                                item['sakai:group-id'] === 'c-' + collectionId) {
                                contentListDisplayed = item;
                                contentListDisplayed._path = collectionId;
                            }
                        });
                        showCollection(contentListDisplayed);
                    } else {
                        animateUIElements('reset');
                    }
                });
            });
        };

        /**
         * Add a batch of dropped items to my library
         * @param {String} collectionId ID of the collection to add the items to
         * @param {Array} collectedCollections Array of collected collection IDs
         * @param {Array} collectedContent Array of collected content IDs
         */
        var addDroppedToMyLibrary = function(collectionId, collectedCollections, collectedContent) {
            $.each(collectedCollections, function(i, collection) {
                sakai.api.Content.addToLibrary(collection, sakai.data.me.user.userid, false, function() {
                    addToCollectionCount(collectionId, 1, false);
                });
            });
            $.each(collectedContent, function(i, content) {
                sakai.api.Content.addToLibrary(content, sakai.data.me.user.userid, false, function() {
                    addToCollectionCount(collectionId, 1, false);
                });
            });
            if (inCollection) {
                showCollection(contentListDisplayed);
            }
            sakai.api.Util.progressIndicator.hideProgressIndicator();
        };

        /**
         * Add a dropped content item to the collection (used for drag and drop inside of window, not from desktop)
         * @param {Object} ev Event fired by dropping a content item onto the list
         * @param {Object} data The data received from the event
         * @param {Object} target jQuery object indicating the drop target
         */
        var addDroppedToCollection = function(ev, data, target) {
            var collectionId = target.attr('data-collection-id');
            var collectedContent = [];
            var collectedCollections = [];
            var isCollection = (collectionId !== 'library' && collectionId !== sakai.data.me.user.userid);
            $.each(data, function(index, item) {
                if (!isCollection || item.canshare) {
                    if (item.collection) {
                        // We don't need to send an extra POST since we can't add a collection to itself
                        if (collectionId !== item.entityid) {
                            collectedCollections.push(item.entityid);
                        } else {
                            sakai.api.Util.notification.show(
                                sakai.api.i18n.getValueForKey('ADD_COLLECTION', 'inserter'),
                                sakai.api.i18n.getValueForKey('CANT_ADD_A_COLLECTION_TO_ITSELF', 'inserter'),
                                sakai.api.Util.notification.type.ERROR);
                        }
                    }
                    else {
                        collectedContent.push(item.entityid);
                    }
                }
            });
            if (collectedContent.length + collectedCollections.length > 0) {
                sakai.api.Util.progressIndicator.showProgressIndicator(
                    sakai.api.i18n.getValueForKey('UPLOADING_CONTENT_ADDING_TO_COLLECTION', 'inserter'),
                    sakai.api.i18n.getValueForKey('WONT_BE_LONG', 'inserter'));
                // If the collection the content was added to is not the user's library
                // share the content with that collection
                // If it is the library execute different API functions
                if (isCollection) {
                    addDroppedToIndependentCollection(collectionId, collectedCollections, collectedContent);
                } else {
                    addDroppedToMyLibrary(collectionId, collectedCollections, collectedContent);
                }
            } else {
                sakai.api.Util.notification.show(
                    sakai.api.i18n.getValueForKey('ADD_CONTENT'),
                    sakai.api.i18n.getValueForKey('COULDNT_ADD_CONTENT', 'inserter'),
                    sakai.api.Util.notification.type.ERROR);
            }
        };

        /**
         * Upload a set of files dropped onto the inserter lists
         * @param {String} collectionId the ID of the collection to associate the content with
         * @param {String} permissions Permissions for the newly uploaded content (default to public)
         * @param {Array} itemsDropped Array of files dropped on the inserter
         */
        var setDataOnDropped = function(collectionId, permissions, itemsDropped) {
            var batchRequests = [];
            var itemIDs = [];
            $.each(itemsDropped, function(index, item) {
                $.extend(item, item.item);
                var splitOnDot = item['sakai:pooled-content-file-name'].split('.');
                // Set initial version
                batchRequests.push({
                    'url': '/p/' + item.poolId + '.save.json',
                    'method': 'POST'
                });
                batchRequests.push({
                    'url': '/p/' + item.poolId,
                    'method': 'POST',
                    'parameters': {
                        'sakai:permissions': permissions,
                        'sakai:copyright': 'creativecommons',
                        'sakai:allowcomments': 'true',
                        'sakai:showcomments': 'true',
                        'sakai:fileextension': splitOnDot[splitOnDot.length -1]
                    }
                });

                itemIDs.push(item.poolId);
                item.hashpath = item.poolId;
                item.permissions = permissions;
            });
            sakai.api.Server.batch(batchRequests, function(success, response) {
                // Set the correct file permissions
                sakai.api.Content.setFilePermissions(itemsDropped, function() {
                    // Add it to the collection
                    if (collectionId !== 'library') {
                        sakai.api.Content.Collections.addToCollection(collectionId, itemIDs, function() {
                            addToCollectionCount(collectionId, itemsDropped.length, false);
                            if (inCollection) {
                                showCollection(contentListDisplayed);
                            }
                            $(window).trigger('done.newaddcontent.sakai', [itemsDropped, 'user']);
                            sakai.api.Util.progressIndicator.hideProgressIndicator();
                        });
                    } else {
                        addToCollectionCount(collectionId, itemsDropped.length, false);
                        if (inCollection) {
                            showCollection(contentListDisplayed);
                        }
                        $(window).trigger('done.newaddcontent.sakai', [itemsDropped, 'user']);
                        sakai.api.Util.progressIndicator.hideProgressIndicator();
                    }
                });
            });
        };

        /**
         * Handles dropping items and applying the fileupload functionality
         */
        var addDnDToElements = function() {
            // Initialize drag and drop from desktop
            $('#inserter_collector', $rootel).fileupload({
                url: '/system/pool/createfile',
                formData: {
                    '_charset_': 'utf-8'
                },
                drop: function(ev, data) {
                    $dropTarget = $(ev.currentTarget);
                    var error = false;
                    $.each(data.files, function(index, file) {
                        if (file.size > 0) {
                            numberOfItemsDropped++;
                        } else {
                            error = true;
                        }
                    });
                    if (error) {
                        sakai.api.Util.notification.show(
                            sakai.api.i18n.getValueForKey('DRAG_AND_DROP_ERROR', 'inserter'),
                            sakai.api.i18n.getValueForKey('ONE_OR_MORE_DROPPED_FILES_HAS_AN_ERROR', 'inserter'));
                    }
                    if (numberOfItemsDropped) {
                        sakai.api.Util.progressIndicator.showProgressIndicator(
                            sakai.api.i18n.getValueForKey('UPLOADING_CONTENT_ADDING_TO_COLLECTION', 'inserter'),
                            sakai.api.i18n.getValueForKey('WONT_BE_LONG', 'inserter'));
                    }
                },
                dropZone: $('#inserter_collector ul li,#inserter_collector .s3d-no-results-container', $rootel),
                done: function(ev, data) {
                    var result = $.parseJSON(data.result);
                    itemsDropped.push(result[data.files[0].name]);
                    if (itemsDropped.length && itemsDropped.length === numberOfItemsDropped) {
                        var collectionId = $dropTarget.attr('data-collection-id');
                        setDataOnDropped(collectionId, 'public', itemsDropped);
                        numberOfItemsDropped = 0;
                        itemsDropped = [];
                    }
                }
            });
        };


        ////////////////////////
        // Infinite scrolling //
        ////////////////////////

        /**
         * Processes an empty infinite scroll list and displays the appropriate message
         */
        var emptyCollectionList = function() {
            var mimetype = $inserterMimetypeFilter.val() || '';
            disableEnableHeader(!$.trim($(inserterCollectionContentSearch, $rootel).val()) && !mimetype);
            var query = $.trim($(inserterCollectionContentSearch, $rootel).val());
            var libraryId = false;
            if (!contentListDisplayed.length) {
                libraryId = sakai.data.me.user.userid;
            }
            if (!$inserterMimetypeFilter.val() || query) {
                sakai.api.Util.TemplateRenderer(inserterNoResultsTemplate, {
                    'search': query,
                    'collection': libraryId || sakai.api.Content.Collections.getCollectionGroupId(contentListDisplayed).replace('c-', '')
                }, $inserterNoResultsContainer);
                $inserterNoResultsContainer.show();
            } else {
                query = $.trim($(inserterCollectionContentSearch, $rootel).val());
                sakai.api.Util.TemplateRenderer(inserterNoResultsTemplate, {
                    'search': 'mimetypesearch',
                    'collection': libraryId || sakai.api.Content.Collections.getCollectionGroupId(contentListDisplayed).replace('c-', '')
                }, $inserterNoResultsContainer);
                $inserterNoResultsContainer.show();
            }
            sakai.api.Util.Droppable.setupDroppable({
                'scope': 'content'
            }, $inserterNoResultsContainer);
            addDnDToElements();
        };

        /**
         * Function executed after the infinite scroll list has been rendered
         * Makes list elements drag and droppable
         */
        var collectionListPostRender = function() {
            // post renderer
            $inserterNoResultsContainer.hide();
            sakai.api.Util.Draggable.setupDraggable({
                connectToSortable: '.contentauthoring_cell_content'
            }, $inserterContentInfiniteScrollContainerList);
            sakai.api.Util.Droppable.setupDroppable({
                scope: 'content'
            }, $inserterContentInfiniteScrollContainerList);
            addDnDToElements();
            animateUIElements('results');
        };

        /**
         * Show the collection of items
         * @param {Object} item Contains data about the collection to be loaded
         */
        var showCollection = function(item) {
            inCollection = true;
            var query = $.trim($(inserterCollectionContentSearch, $rootel).val()) || '*';
            var mimetype = $inserterMimetypeFilter.val() || '';

            var params = {
                sortOn: '_lastModified',
                sortOrder: 'desc',
                q: query,
                mimetype: mimetype
            };
            if (item === 'library' || library) {
                library = true;
                params.userid = sakai.data.me.user.userid;
            } else {
                library = false;
                contentListDisplayed = item._path || item;
                params.userid = sakai.api.Content.Collections.getCollectionGroupId(contentListDisplayed);
            }

            // Disable the previous infinite scroll
            killInfiniteScroll();
            infinityContentScroll = $inserterCollectionItemsList.infinitescroll(
                sakai.config.URL.POOLED_CONTENT_SPECIFIC_USER,
                params,
                function(items, total) {
                    disableEnableHeader(false);
                    return sakai.api.Util.TemplateRenderer(inserterCollectionContentTemplate, {
                        items: items,
                        collection: params.userid.replace('c-', ''),
                        sakai: sakai
                    });
                },
                emptyCollectionList,
                sakai.config.URL.INFINITE_LOADING_ICON,
                handleLibraryItems,
                collectionListPostRender,
                sakai.api.Content.getNewList(contentListDisplayed),
                false,
                $inserterContentInfiniteScrollContainer
            );
        };

        /**
         * Fetch the user's library and render an infinite scroll
         */
        var fetchLibrary = function() {
            var params = {
                sortOn: '_lastModified',
                sortOrder: 'desc',
                q: '',
                mimetype: 'x-sakai/collection'
            };
            // Disable the previous infinite scroll
            killInfiniteScroll();
            infinityCollectionScroll = $inserterCollectionInfiniteScrollContainerList.infinitescroll(sakai.config.URL.POOLED_CONTENT_SPECIFIC_USER, params, function(items, total) {
                // render
                return sakai.api.Util.TemplateRenderer(inserterInitTemplate, {
                    collections: items,
                    sakai: sakai
                });
            }, function() {
                // empty list processor
            }, sakai.config.URL.INFINITE_LOADING_ICON, handleLibraryItems, function() {
                // post renderer
                animateUIElements('reset');
                sakai.api.Util.Draggable.setupDraggable({
                    connectToSortable: '.contentauthoring_cell_content'
                }, $inserterInitContainer);
                sakai.api.Util.Droppable.setupDroppable({
                    scope: 'content'
                }, $inserterInitContainer);
                addDnDToElements();
            }, function() {
                sakai.api.Content.getNewList(contentListDisplayed);
            }, function() {
                // initial callback
            }, $inserterCollectionInfiniteScrollContainer);
        };

        /**
         * Opens the inserter and focuses the new collection input
         * @param {ev} ev Event catched that opens the inserter
         * @param {data} data Contains content items to be associated with the new collection
         */
        var openAddNewCollection = function(ev, data) {
            focusCreateNew = true;
            contentToAdd = data;
            if (!$inserterWidget.is(':visible')) {
                toggleInserter();
            } else {
                renderHeader('init');
                animateUIElements('reset');
                inCollection = false;
                $(inserterCreateCollectionInput).focus();
            }
        };

        /**
         * Checks the position of the inserter on scroll and adjusts if necessary
         */
        var checkInserterPosition = function() {
            if ($(window).scrollTop() <= topMargin && $inserterWidget.offset().top < topMargin) {
                $inserterWidget.animate({
                    'top': topMargin
                }, 200);
            }
        };


        ////////////////////
        // Initialization //
        ////////////////////

        /**
         * Add binding to various elements of the widget
         */
        var addBinding = function() {
            $(window).on('click', '#subnavigation_add_collection_link', openAddNewCollection);
            $(window).on('create.collections.sakai', openAddNewCollection);
            $(window).on('done.deletecontent.sakai', removeFromLibraryCount);
            $(window).on('done.newaddcontent.sakai', function() {
                addToCollectionCount('library', 0, false);
            });
            $(window).on('sakai.mylibrary.deletedCollections', function(ev, data) {
                if (infinityCollectionScroll) {
                    infinityCollectionScroll.removeItems(data.items);
                }
            });
            $(window).on('start.drag.sakai', function() {
                if (!$inserterWidget.is(':visible')) {
                    toggleInserter();
                }
            });
            $(document).on('click', inserterToggle, toggleInserter);
            $inserterCollectionInfiniteScrollContainer.on('click', 'li', collectionClicked);
            $inserterCollectionContentContainer.on('click', inserterAllCollectionsButton, refreshWidget);
            $inserterCollectionContentContainer.on('keyup', inserterCollectionContentSearch, searchCollection);
            $inserterCollectionContentContainer.on('click', '.s3d-search-button', searchCollection);
            $inserterCollectionContentContainer.on('change', inserterMimetypeFilter, function() {
                showCollection(contentListDisplayed);
            });
            $(window).off('sakai.collections.created').on('sakai.collections.created', refreshWidget);
            $(window).off('sakai.inserter.dropevent').on('sakai.inserter.dropevent', addDroppedToCollection);
            $(window).off('scroll', checkInserterPosition).on('scroll', checkInserterPosition);
            $(window).on('updateCount.inserter.sakai', updateCollectionCount);
        };

        /**
         * Initialize the inserter widget
         */
        var doInit = function() {
            $inserterCollectionContentContainer.hide();
            $inserterWidget.css('top', topMargin);
            $inserterWidget.draggable({
                cancel: 'div#inserter_collector',
                stop: function(ev) {
                    // Calculate the position of the widget and reset its position when
                    // it goes out of bounds
                    var elOffset = $(ev.target).offset();
                    var wHeight = $(window).height();
                    var wWidth = $(window).width();
                    var iHeight= $inserterWidget.height();
                    var iWidth = $inserterWidget.width();
                    var borderMargin = 15;
                    if (elOffset) {
                        // Overlaps left window border
                        if (elOffset.left <= 0) {
                            $inserterWidget.css('left', borderMargin);
                        }
                        // Overlaps right window border
                        if (elOffset.left > wWidth - iWidth) {
                            $inserterWidget.css('left', wWidth - iWidth - borderMargin);
                        }
                        // Overlaps top window border or topnavigation
                        if (elOffset.top < topMargin) {
                            $inserterWidget.css('top', topMargin);
                        }
                        // Overlaps bottom window border
                        if (elOffset.top > $(window).scrollTop() + wHeight - iHeight) {
                            $inserterWidget.css('top', wHeight - iHeight - borderMargin);
                        }
                        // Store new position
                        widgetPos = {
                            'left': $inserterWidget.css('left'),
                            'top': $inserterWidget.css('top')
                        };
                    } else {
                        $inserterWidget.css({
                            'left': widgetPos.left,
                            'top': widgetPos.top
                        });
                    }
                }
            });
            renderHeader('init');
            sakai.api.Util.TemplateRenderer('inserter_init_prescroll_template', {
                sakai: sakai
            }, $inserterCollectionInfiniteScrollContainer);
            $inserterCollectionInfiniteScrollContainerList = $($inserterCollectionInfiniteScrollContainerList, $rootel);
            validateNewCollectionForm();
            fetchLibrary();
            if (focusCreateNew) {
                $(inserterCreateCollectionInput).focus();
            }
        };

        addBinding();
    };
    
    
    sakai_global.inserterbar = function (tuid, showSettings) {


        /////////////////////////////
        // Configuration variables //
        /////////////////////////////

        var $rootel = $('#' + tuid);

        // Containers
        var $contentauthoringWidget = $('#contentauthoring_widget');
        var $inserterbarWidget = $('#inserterbar_widget', $rootel);
        var $inserterbarMoreWidgets = $('#inserterbar_more_widgets', $rootel);
        var $inserterbarWidgetContainer = $('#inserterbar_widget_container', $rootel);
        
        // Elements
        var $inserterbarCarouselLeft = $('#inserterbar_carousel_left', $rootel);
        var $inserterbarCarouselRight = $('#inserterbar_carousel_right', $rootel);
        var $inserterbarMoreWidgetsContainer = $('#inserterbar_more_widgets_container', $rootel);


        ///////////////////////
        // Utility Functions //
        ///////////////////////

        /**
         * Shows/Hides more widgets that can be inserted into the page
         */
        var showHideMoreWidgets = function() {
            $(this).children('span').toggle();
            $('#inserterbar_more_widgets_container', $rootel).toggle();
            resetPosition();
        };

        /**
         * Renders more widgets that can be inserted into the page
         */
        var renderWidgets = function() {
            // Render the list of exposed widgets
            sakai.api.Util.TemplateRenderer('inserterbar_widget_container_exposed_template', {
                'sakai': sakai, 
                'widgets': sakai.config.exposedSakaiDocWidgets
            }, $('#inserterbar_widget_container_exposed', $rootel));
            // Bind the hover
            $('#inserterbar_widget_container_exposed .inserterbar_widget_exposed', $rootel).hover(function() {
                    var $container = $(this);
                    if ($('.inserterbar_standard_icon_hover', $container).length) {
                        $('.inserterbar_standard_icon_out', $container).hide();
                        $('.inserterbar_standard_icon_hover', $container).show();
                    }
                }, function() {
                    var $container = $(this);
                    $('.inserterbar_standard_icon_out', $container).show();
                    $('.inserterbar_standard_icon_hover', $container).hide();
                }
            );

            // Render the more widgets list
            var moreWidgets = [];
            $.each(sakai.widgets, function(widgetid, widget) {
                if (widget.sakaidocs && $.inArray(widgetid, sakai.config.exposedSakaiDocWidgets) === -1) {
                    moreWidgets.push(widget);
                }
            });
            sakai.api.Util.TemplateRenderer('inserterbar_dynamic_widget_list_template', {
                'sakai': sakai,
                'widgets': moreWidgets
            }, $('#inserterbar_dynamic_widget_list', $rootel));

            if (moreWidgets.length > 4) {
                setupCarousel();
            } else {
                $inserterbarMoreWidgetsContainer.hide();
                $('#inserterbar_carousel_left', $rootel).hide();
                $('#inserterbar_carousel_right', $rootel).hide();
            }
            $inserterbarWidgetContainer.removeClass('fl-hidden');

            setupSortables();
            resetPosition();
        };


        ////////////////////
        // Initialization //
        ////////////////////

        /**
         * Sets the widgets up as sortables so they can be dragged into the page
         */
        var setupSortables = function() {
            $('#inserterbar_widget .inserterbar_widget_draggable', $rootel).draggable({
                connectToSortable: '.contentauthoring_cell_content',
                helper: 'clone',
                revert: 'invalid',
                opacity: 0.4,
                start: function() {
                    $(window).trigger('startdrag.contentauthoring.sakai');
                    sakai.api.Util.Draggable.setIFrameFix();
                },
                stop: function() {
                    $(window).trigger('stopdrag.contentauthoring.sakai');
                    sakai.api.Util.Draggable.removeIFrameFix();
                }
            });
        };

        /**
         * Adds binding to the carousel that contains more widgets
         * @param {Object} carousel Carousel object (jcarousel)
         */
        var carouselBinding = function(carousel) {
            $inserterbarCarouselLeft.live('click',function() {
                carousel.prev();
            });
            $inserterbarCarouselRight.live('click',function() {
                carousel.next();
            });
            var carouselListWidth = parseInt(carousel.list.css('width'), 10);
            carousel.list.css('width' , carouselListWidth * carousel.options.size);
        };

        /**
         * Sets up the carousel that contains more widgets
         */
        var setupCarousel = function() {
            $('#inserterbar_more_widgets_container .s3d-outer-shadow-container', $rootel).jcarousel({
                animation: 'slow',
                easing: 'swing',
                scroll: 4,
                itemFirstInCallback: carouselBinding,
                itemFallbackDimension: 4,
                visible: 4
            });

            $inserterbarMoreWidgetsContainer.hide();
        };

        /**
         * Position the inserterBar correctly
         */
        var positionInserterBar = function() {
            if ($inserterbarWidgetContainer.is(":visible")) {
                var top = $inserterbarWidgetContainer.position().top;
                var scroll = $.browser.msie ? $('html').scrollTop() : $(window).scrollTop();
                if (scroll > top) {
                    if (scroll >= ($contentauthoringWidget.height() + top - ($inserterbarWidget.height() / 2))) {
                        $('.sakaiSkin[role="listbox"]').css('position', 'absolute');
                        $inserterbarWidget.css('position', 'absolute');
                    } else {
                        $('.sakaiSkin[role="listbox"]').css('position', 'fixed');
                        $inserterbarWidget.css({
                            'position': 'fixed',
                            'top': '0px'
                        });
                    }
                } else {
                    $('.sakaiSkin[role="listbox"]').css('position', 'absolute');
                    $inserterbarWidget.css({
                        'position': 'absolute',
                        'top': top + 'px'
                    });
                }
            }
        };

        /**
         * Re-position the bar based on its current width
         */
        var resetPosition = function() {
            var right = $(window).width() - ($contentauthoringWidget.position().left + $contentauthoringWidget.width()) - 15;
            $inserterbarWidget.css('right', right + 'px');
            positionInserterBar();
        };

        /**
         * Hide all of the panes in the inserterbar. This will be executed
         * before the right panel is shown.
         */
        var hideAllModes = function() {
            $('#inserterbar_view_container', $rootel).hide();
            $('#inserterbar_default_widgets_container', $rootel).hide();
            $('#inserterbar_tinymce_container', $rootel).hide();
            $('#inserterbar_revision_history_container', $rootel).hide();
            $('#inserterbar_more_widgets_container', $rootel).hide();
        };

        /**
         * Put the inserter bar into page edit mode
         */
        var setInserterForEditMode = function() {
            hideAllModes();
            $('#inserterbar_default_widgets_container', $rootel).show();
            resetPosition();
        };

        /**
         * Put the inserter bar into view mode
         */
        var setInserterForViewMode = function() {
            hideAllModes();
            $('#inserterbar_view_container', $rootel).show();
            resetPosition();
        };

        /**
         * Put the inserter bar into revision history mode
         */
        var setInserterForRevisionHistoryMode = function() {
            hideAllModes();
            $('#inserterbar_revision_history_container', $rootel).show();
            resetPosition();
        };

        /**
         * Adds bindings to the widget elements
         */
        var addBinding = function() {
            $inserterbarMoreWidgets.click(showHideMoreWidgets);
            // Hide the tinyMCE toolbar when we click outside of a tinyMCE area
            sakai.api.Util.hideOnClickOut($('#inserterbar_tinymce_container'), ".mceMenu, .mce_forecolor");

            $('#inserterbar_action_close_revision_history').live('click', function() {
                $(window).trigger("close.versions.sakai");
            });


            $('#inserterbar_action_revision_history').live('click', setInserterForRevisionHistoryMode);
            $('#inserterbar_action_close_revision_history').live('click', setInserterForViewMode);
            $(window).bind('edit.contentauthoring.sakai', setInserterForEditMode);
            $(window).bind('render.contentauthoring.sakai', setInserterForViewMode);

            $(window).on('scroll', positionInserterBar);
            $(window).on('position.inserter.sakai', positionInserterBar);
            $(window).resize(resetPosition);
        };

        /**
         * Initializes the widget
         */
        var doInit = function() {
            var top = 130;
            if (sakai.config.enableBranding) {
                top = top + $('.branding_widget').height();
            }
            $inserterbarWidget.css({
                'right': $(window).width() - ($contentauthoringWidget.position().left + $contentauthoringWidget.width()) - 15,
                'top': top
            });
            addBinding();
            renderWidgets();
        };

        doInit();

    };
    
    
    sakai_global.institutionalskinning = function (tuid, showSettings) {

    };
    
    
    sakai_global.joingroup = function (tuid, showSettings) {

        /////////////////////////////
        // Configuration variables //
        /////////////////////////////

        // DOM jQuery Objects
        var $rootel = $("#" + tuid);  // unique container for each widget instance
        var $joingroup_hover_template = $("#joingroup_hover_template", $rootel);

        ///////////////////////
        // Utility Functions //
        ///////////////////////

        /**
         * Compare the names of 2 participants
         *
         * @param {Object} participant a
         * @param {Object} participant b
         * @return 1, 0 or -1
         */
        var participantSort = function (a, b) {
            if (a.displayname.toLowerCase() > b.displayname.toLowerCase()) {
                return 1;
            } else {
                if (a.displayname.toLowerCase() === b.displayname.toLowerCase()) {
                    return 0;
                } else {
                    return -1;
                }
            }
        };

        /**
         * Adjust the number of participants listed in the search result
         *
         * @param {String} groupid The group ID
         * @param {Integer} value Value to adjust the number of participants by
         */
        var adjustParticipantCount = function (groupid, value) {
            var participantCount = parseInt($("#searchgroups_result_participant_count_" + groupid).text(), 10);
            participantCount = participantCount + value;
            $("#searchgroups_result_participant_count_" + groupid).text(participantCount);
            if (participantCount === 1) {
                $("#searchgroups_text_participant_" + groupid).text(sakai.api.i18n.getValueForKey("PARTICIPANT"));
            } else {
                $("#searchgroups_text_participant_" + groupid).text(sakai.api.i18n.getValueForKey("PARTICIPANTS"));
            }
            $("#searchgroups_result_participant_link_" + groupid).attr("title", $.trim($("#searchgroups_result_participant_link_" + groupid).text()));
        };

        /**
         * Push the given member to the given list of members to be rendered.
         * If the member is a manager, set is_manager to 'true'
         *
         * @param {Object} member      object returned in batch data results
         * @param {Object} list        list of members to add to
         * @param {Object} is_manager  optional flag to set whether this user
         *     is a manager or not
         */
        var push_member_to_list = function (member, list, role) {
            var link, picsrc, displayname = "";
            if (member["sakai:group-id"]) {
                picsrc = sakai.api.Groups.getProfilePicture(member);
                link = "~" + member.groupid;
                displayname = member["sakai:group-title"];
            } else {
                picsrc = sakai.api.User.getProfilePicture(member);
                link = "~" + member.userid;
                displayname = sakai.api.User.getDisplayName(member);
            }
            list.push({
                link: link,
                picsrc: picsrc,
                displayname: displayname,
                role: role
            });
        };

        var getGroup = function(groupid, callback) {
            var group = {};
            // get batch group data for this group
            var batchRequests = [
                {
                    url: "/var/joinrequests/list.json?groupId=" + groupid,
                    method: "GET"
                },
                {
                    url: '/system/userManager/group/' + groupid + '.json',
                    method: "GET"
                }
            ];
            sakai.api.Server.batch(batchRequests, function (success, data) {
                if (success && data && data.results && data.results.length) {
                    var participants = [];
                    // join requests
                    if (data.results[0].body) {
                        var joinrequests = $.parseJSON(data.results[0].body);
                        group.joinrequests = joinrequests;
                    }
                    // joinability info
                    if (data.results[1].body) {
                        var groupdata = $.parseJSON(data.results[1].body);
                        group.groupProfile = groupdata.properties;
                        group.joinability = groupdata.properties['sakai:group-joinable'];
                        group.title = groupdata.properties['sakai:group-title'];
                        group.id = groupid;
                    }
                    sakai.api.Groups.getMembers(groupid, function(success, members) {
                        members = members[groupid];
                        group.groupMembers = members;

                        $.each(members, function(role, users) {
                            if (users.results) {
                                $.each(users.results, function(index, user) {
                                    push_member_to_list(user, participants, role);
                                });
                            }
                        });

                        if (group.groupMembers.Manager && group.groupMembers.Manager.results){
                            group.managerCount = group.groupMembers.Manager.results.length;
                        }
                        group.totalParticipants = participants.length;
                        if (participants.length > 1) {
                            participants = participants.sort(participantSort);
                        }
                        if (participants.length > 5) {
                            participants = participants.slice(0, 5);
                            group.seeAll = true;
                        } else {
                            group.seeAll = false;
                        }
                        group.participants = participants;
                        if ($.isFunction(callback)){
                            callback(group);
                        }
                    }, true);
                } else {
                    debug.error("Batch request to fetch group (id: " + id + ") data failed.");
                }
            });
            return group;
        };

        var openTooltip = function (groupid, $item, leaveAllowed) {
            getGroup(groupid, function(group) {
                group.sakai = sakai;
                var adjustHeight = 0;
                if (sakai.config.enableBranding && $('.branding_widget').is(':visible')) {
                    adjustHeight = parseInt($('.branding_widget').height(), 10) * -1;
                }
                $(window).trigger("init.tooltip.sakai", {
                    tooltipHTML: sakai.api.Util.TemplateRenderer(
                        $joingroup_hover_template, group),
                    tooltipAutoClose: true,
                    tooltipArrow: "top",
                    tooltipTop: $item.offset().top + $item.height() + adjustHeight,
                    tooltipLeft: $item.offset().left + $item.width() + 3,
                    onShow: function () {
                        $(window).trigger("init.joinrequestbuttons.sakai", [
                            {
                                "groupProfile": group.groupProfile,
                                "groupMembers": group.groupMembers,
                                "leaveAllowed": leaveAllowed
                            },
                            groupid,
                            group.joinability,
                            group.managerCount,
                            false,
                            function (renderedButtons) {
                                // onShow
                                $("#joingroup_joinrequestbuttons").html(
                                    renderedButtons.html());
                            },
                            function (success, id) {
                                // requestCallback
                                if (success) {
                                    // reset joinrequest data
                                    group.joinrequests = false;
                                }
                            },
                            function (success, id) {
                                // joinCallback
                                if (success) {
                                    // re-render tooltip
                                    resetTooltip(groupid, $item);
                                    $("#searchgroups_memberimage_" + groupid).show();
                                    $("#searchgroups_memberimage_" + groupid).parent().removeClass("s3d-actions-addtolibrary");
                                    adjustParticipantCount(groupid, 1);
                                }
                            },
                            function (success, id) {
                                // leaveCallback
                                if (success) {
                                    // re-render tooltip
                                    resetTooltip(groupid, $item);
                                    $("#searchgroups_memberimage_" + groupid).hide();
                                    $("#searchgroups_memberimage_" + groupid).parent().addClass("s3d-actions-addtolibrary");
                                    adjustParticipantCount(groupid, -1);
                                }
                            },
                            group.joinrequests
                        ]);
                    }
                });
            });
        };

        var resetTooltip = function (groupid, $item) {
            $(window).trigger("done.tooltip.sakai");
            openTooltip(groupid, $item);
        };

        /////////////////////////////
        // Initialization function //
        /////////////////////////////

        var doInit = function () {
            $(window).bind("initialize.joingroup.sakai", function(evObj, groupid, target){
                sakai.api.Groups.isAllowedToLeave(groupid, sakai.data.me, function(leaveAllowed){
                    openTooltip(groupid, $(target), leaveAllowed[groupid]);
                });
                return false;
            });
        };

        // run the initialization function when the widget object loads
        doInit();

    };
    
    
    
    sakai_global.lhnavigation = function (tuid, showSettings) {

        ///////////////////
        // CONFIGURATION //
        ///////////////////

        var $rootel = $('#' + tuid);

        // Classes
        var navSelectedItemClass = 'lhnavigation_selected_item';
        var navHoverableItemClass = 'lhnavigation_hoverable_item';

        // Elements
        var navSelectedItemArrow = '.lhnavigation_selected_item_arrow';
        var navSelectedItem = '.lhnavigation_selected_item';

        var $lhnavigation_contentauthoring_declaration = $('#lhnavigation_contentauthoring_declaration'),
            $lhnavigation_contentauthoring_declaration_template = $('#lhnavigation_contentauthoring_declaration_template');

        ////////////////
        // DATA CACHE //
        ////////////////

        var privstructure = false;
        var pubstructure = false;
        var contextData = false;
        var infinityStructuresPulled = []; // Contains a list of all the pages which are already loaded

        var parametersToCarryOver = {};
        var sakaiDocsInStructure = {};
        var currentPageShown = {};

        var doNotRenderSakaiDocsOnPaths = ['/content'];


        //////////////////////////////
        // Rendering the navigation //
        //////////////////////////////

        var renderData = function() {
            calculateOrder();
            var lhnavHTML = sakai.api.Util.TemplateRenderer('lhnavigation_template', {
                'private': privstructure,
                'public': pubstructure,
                'contextData': contextData,
                'parametersToCarryOver': parametersToCarryOver
            });
            $('#lhnavigation_container').html(lhnavHTML);
        };

        ////////////////////////
        // Update page counts //
        ////////////////////////

        var updateCounts = function(pageid, value, add) {
            // Adjust the count value by the specified value for the page ID
            if (add !== false) {
                add = true;
            }
            var subpage = false;
            if (pageid.indexOf('/') !== -1) {
                var parts = pageid.split('/');
                pageid = parts[0];
                subpage = parts[1];
            }

            var adjustCount = function(pageStructure, pageid, subpage, value) {
                var listitem = 'li[data-sakai-addcontextoption="user"][data-sakai-path=\'';
                var count;
                var element;
                if (subpage) {
                    count = pageStructure.items[pageid][subpage];
                    listitem = $(listitem + pageid + '/' + subpage + '\']');
                    element = '.lhnavigation_sublevelcount';
                } else {
                    count = pageStructure.items[pageid];
                    listitem = $(listitem + pageid + '\']');
                    element = '.lhnavigation_levelcount';
                }
                if (add) {
                    count._count = (count._count || 0) + value;
                } else {
                    count._count = value;
                }
                if (listitem.length) {
                    if (!listitem.find('.lhnavigation_levelcount').length) {
                        listitem.find('.lhnavigation_item_content').prepend(
                            sakai.api.Util.TemplateRenderer('lhnavigation_counts_template', {
                            'count': 0
                            })
                        );
                    }
                    $(element, listitem).text(count._count);
                    if (count._count <= 0) {
                        $(element, listitem).hide();
                    } else {
                        $(element, listitem).show();
                    }
                }
                return pageStructure;
            };

            if (pubstructure && pubstructure.items[pageid]) {
                pubstructure = adjustCount(pubstructure, pageid, subpage, value);
            } else if (privstructure && privstructure.items[pageid]) {
                privstructure = adjustCount(privstructure, pageid, subpage, value);
            }
        };

        //////////////////
        // Data storage //
        //////////////////

        var storeStructure = function(structure, savepath) {
            sakai.api.Server.saveJSON(savepath, {
                'structure0': $.toJSON(structure)
            });
        };

        ////////////////////////////////////
        // Structure processing functions //
        ////////////////////////////////////

        /**
         * Given a path to a page in a structure, return the page
         *
         * @param {String} path The path to the page, ie. 'syllabus/week1'
         * @param {Object} structure The structure to find the path in, ie. pubstructure.items
         * @return {Object} the page
         */
        var getPage = function(path, structure) {
            if (path.indexOf('/') > -1) {
                structure = structure[path.split('/')[0]];
                path = path.substring(path.indexOf('/')+1);
                return getPage(path, structure);
            } else if (structure[path]) {
                return structure[path];
            } else {
                return null;
            }
        };

        var getPageCount = function(pagestructure, pageCount) {
            if (!pageCount) {
                pageCount = 0;
            }
            for (var tl in pagestructure) {
                if (pagestructure.hasOwnProperty(tl) && tl.substring(0, 1) !== '_') {
                    pageCount++;
                    if (pageCount >= 3) {
                        return 3;
                    }
                    pageCount = getPageCount(pagestructure[tl], pageCount);
                }
            }
            return pageCount;
        };

        var returnStructure = function(ref) {
            if (privstructure.pages[ref]) {
                return privstructure.pages[ref];
            } else if (pubstructure.pages[ref]) {
                return pubstructure.pages[ref];
            } else {
                return false;
            }
        };

        var getPageContent = function(ref, callback) {
            // Check whether a page has been loaded before
            if ($.inArray(ref, infinityStructuresPulled) === -1) {
                var toplevelref = ref.split('-')[0];
                var subpageref = ref.split('-')[1];

                if (toplevelref && subpageref) {
                    $.ajax({
                        url: '/p/' + toplevelref + '/' + subpageref + '.infinity.json',
                        dataType: 'json',
                        success: function(data) {
                            infinityStructuresPulled.push(ref);
                            sakai.api.Server.convertObjectToArray(data, null, null);
                            if (data && data.rows && data.rows.length) {
                                $.each(data.rows, function(index, row) {
                                    if (!$.isPlainObject(row)) {
                                        data.rows[index] = $.parseJSON(row);
                                    }
                                });
                            }
                            if (privstructure.pages.hasOwnProperty(toplevelref + '-_lastModified')) {
                                privstructure.pages[ref] = data;
                            } else {
                                pubstructure.pages[ref] = data;
                            }
                            callback();
                        }
                    });
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };

        var includeChildCount = function(structure) {
            var childCount = 0;
            for (var level in structure) {
                if (level && level.substring(0,1) !== '_') {
                    childCount++;
                    structure[level] = includeChildCount(structure[level]);
                } else if (level && level === '_title') {
                    structure[level] = sakai.api.i18n.General.process(structure[level]);
                } else if (level && level === '_altTitle') {
                    structure[level] = sakai.api.i18n.General.process(structure[level]);
                    structure[level] = structure[level].replace('${user}', sakai.api.User.getFirstName(contextData.profile));
                }
            }
            structure._childCount = childCount;
            return structure;
        };

        var finishProcessData = function(structure, data, callback) {
            // Include the childcounts for the pages
            structure.items = includeChildCount(structure.items);
            for (var page in data) {
                if (page.substring(0,9) !== 'structure' && page.substring(0,1) !== '_') {
                    structure.pages[page] = data[page];
                }
            }
            callback(structure);
        };

        var processData = function(data, docURL, callback) {
            var structure = {};
            structure.items = {};
            structure.pages = {};
            if (data['structure0']) {
                if (typeof data['structure0'] === 'string') {
                    structure.items = $.parseJSON(data['structure0']);
                } else {
                    structure.items = data['structure0'];
                }
                for (var i in structure.items) {
                    if (structure.items.hasOwnProperty(i)) {
                        structure.items[i] = addDocUrlIntoStructure(structure.items[i], docURL);
                    }
                }
                // Get a list of all Sakai Docs that have to be 'added'
                var pids = collectPoolIds(structure.items, []);
                if (pids.length === 0) {
                    finishProcessData(structure, data, callback);
                } else {
                    continueProcessData(structure, data, pids, callback);
                }
            } else {
                finishProcessData(structure, data, callback);
            }
        };

        ////////////////////////////////////////////
        // Insert referenced pooled content items //
        ////////////////////////////////////////////

        var collectPoolIds = function(structure, refs) {
            for (var level in structure) {
                if (level && level.substring(0, 1) !== '_') {
                    refs = collectPoolIds(structure[level], refs);
                } else if (level && level === '_pid' && structure['_canView'] !== false) {
                    if ($.inArray(structure[level], refs) == -1) {
                        refs.push(structure[level]);
                    }
                }
            }
            return refs;
        };

        var insertDocStructure = function(structure0, docInfo, pid) {
            for (var level in structure0) {
                if (structure0[level]._pid && structure0[level]._pid === pid) {
                    var docStructure = docInfo.structure0;
                    if (typeof docStructure === 'string') {
                        docStructure = $.parseJSON(docStructure);
                    }
                    structure0[level] = $.extend(true, structure0[level], docStructure);
                    for (var sublevel in structure0[level]) {
                        if (structure0[level][sublevel]._ref) {
                            structure0[level][sublevel]._ref = pid + '-' + structure0[level][sublevel]._ref;
                        }
                    }
                    for (var subpage in docStructure) {
                        if (docStructure[subpage]._ref) {
                            structure0[level]._ref = pid + '-' + docStructure[subpage]._ref;
                            break;
                        }
                    }
                }
            }
            return structure0;
        };

        var insertDocPages = function(structure, docInfo, pid) {
            for (var page in docInfo) {
                if (page.substring(0, 9) !== 'structure') {
                    structure.pages[pid + '-' + page] = docInfo[page];
                }
            }
            return structure;
        };

        var addDocUrlIntoStructure = function(structure, url) {
            structure._poolpath = url;
            for (var i in structure) {
                if (structure.hasOwnProperty(i) && i.substring(0,1) !== '_' && typeof structure[i] !== 'string') {
                    structure[i] = addDocUrlIntoStructure(structure[i], url);
                }
            }
            return structure;
        };

        var continueProcessData = function(structure, data, pids, callback) {
            // Prepare a batch request
            var batchRequests = [];
            for (var i = 0; i < pids.length; i++) {
                batchRequests.push({
                    'url': '/p/' + pids[i] + '.json',
                    'method': 'GET'
                });
            }
            sakai.api.Server.batch(batchRequests, function(success, data) {
                if (success) {
                    for (var i = 0; i < pids.length; i++) {
                        if (data.results[i].status === 404 || data.results[i].status === 403) {
                            for (var level in structure.items) {
                                if (structure.items[level]._pid && structure.items[level]._pid === pids[i]) {
                                    structure.items[level]._canView = false;
                                    structure.items[level]._canEdit = false;
                                    structure.items[level]._canSubedit = false;
                                }
                            }
                        } else {
                            var docInfo = sakai.api.Server.cleanUpSakaiDocObject($.parseJSON(data.results[i].body));
                            docInfo.orderedItems = orderItems(docInfo.structure0);
                            sakaiDocsInStructure['/p/' + pids[i]] = docInfo;
                            addDocUrlIntoStructure(docInfo.structure0, '/p/' + pids[i]);
                            structure.items = insertDocStructure(structure.items, docInfo, pids[i]);
                            structure = insertDocPages(structure, docInfo, pids[i]);
                        }
                    }
                }
                finishProcessData(structure, data, callback);
            });
        };

        ///////////////////
        // Page ordering //
        ///////////////////

        var getLowestOrderItem = function(items, alreadyAdded) {
            var ret = false,
                lowest = false;
            $.each(items, function(idx, item) {
                idx = ''+idx;
                // if it is a valid property to order
                if (idx.substring(0,1) !== '_' && item.hasOwnProperty('_order')) {
                    // and it is the lowest in the list and we haven't already ordered it
                    if ((lowest === false || item._order < lowest) && $.inArray(idx, alreadyAdded) === -1) {
                        lowest = item._order;
                        ret = [idx,item];
                    }
                }
            });
            return ret;
        };

        var orderItems = function(items) {
            var orderedItems = [],
                alreadyAdded = [],
                order = 0;
            if (items) {
                $.each(items, function(idx, item) {
                    var toAdd = getLowestOrderItem(items, alreadyAdded);
                    var itemToAdd = toAdd[1], itemID = toAdd[0];
                    if (toAdd) {
                        itemToAdd._order = order;
                        order++;
                        itemToAdd._id = itemID;
                        itemToAdd._elements = orderItems(itemToAdd);
                        orderedItems.push(itemToAdd);
                        alreadyAdded.push(itemID);
                    }
                });
            }
            return orderedItems;
        };

        var calculateOrder = function() {
            if (privstructure && privstructure.items) {
                privstructure.orderedItems = orderItems(privstructure.items);
            }
            if (pubstructure && pubstructure.items) {
                pubstructure.orderedItems = orderItems(pubstructure.items);
            }
        };

        //////////////////////////////
        // Rendering a content page //
        //////////////////////////////

        /**
         * Displays a page unavailable error message
         */
        var renderPageUnavailable = function() {
            unavailablePage = {
                'ref': false,
                'path': false,
                'content': {
                    'unavailablePage1': {
                        'htmlblock': {
                            'content': sakai.config.pageUnavailableContent
                        }
                    },
                    'rows': [{
                        'columns': [{
                            'elements': [{
                                'id': 'unavailablePage1',
                                'type': 'htmlblock'
                            }],
                            width: 1
                        }]
                    }]
                },
                'savePath': false,
                'pageSavePath': false,
                'saveRef': false,
                'canEdit': false,
                'nonEditable': false,
                '_lastModified': false,
                'autosave': false,
                'title': false
            };
            $(window).trigger('showpage.contentauthoring.sakai', [unavailablePage]);
        };

        var getFirstSelectablePage = function(structure) {
            var selected = false;
            if (structure.orderedItems) {
                for (var i = 0; i < structure.orderedItems.length; i++) {
                    if (structure.orderedItems[i]._canView !== false) {
                        if (structure.orderedItems[i]._childCount > 1) {
                            for (var ii = 0; ii < structure.orderedItems[i]._elements.length; ii++) {
                                selected = structure.orderedItems[i]._id + '/' + structure.orderedItems[i]._elements[ii]._id;
                                break;
                            }
                        } else {
                            selected = structure.orderedItems[i]._id;
                        }
                        break;
                    }
                }
            }
            return selected;
        };

        var getFirstSubPage = function(structure, selected) {
            for (var i = 0; i < structure.orderedItems.length; i++) {
                if (structure.orderedItems[i]._canView !== false && structure.orderedItems[i]._id === selected) {
                    for (var ii = 0; ii < structure.orderedItems[i]._elements.length; ii++) {
                        selected = structure.orderedItems[i]._id + '/' + structure.orderedItems[i]._elements[ii]._id;
                        break;
                    }
                }
            }
            return selected;
        };

        var checkPageExists = function(structure, selected) {
            var structureFoundIn = false;
            if (selected.indexOf('/') !== -1) {
                var splitted = selected.split('/');
                if (structure.items[splitted[0]] && structure.items[splitted[0]][splitted[1]]) {
                    structureFoundIn = structure;
                }
            } else {
                if (structure.items[selected]) {
                    structureFoundIn = structure;
                }
            }
            return structureFoundIn;
        };

        var selectPage = function(newPageMode) {
            if (contextData.forceOpenPage) {
                $.bbq.pushState({
                    'l': contextData.forceOpenPage
                }, 0);
                contextData.forceOpenPage = false;
            } else {
                var state = $.bbq.getState('l');
                var selected = state || false;
                var structureFoundIn = false;
                // Check whether this page exist
                if (selected) {
                    structureFoundIn = checkPageExists(privstructure, selected) || checkPageExists(pubstructure, selected);
                    if (!structureFoundIn) {
                        selected = false;
                    }
                }
                // If it exists, check whether it has more than 1 subpage
                if (selected && selected.indexOf('/') === -1) {
                    if (structureFoundIn.items[selected]._childCount > 1) {
                        selected = getFirstSubPage(structureFoundIn, selected);
                    }
                }
                // If no page is selected, select the first one from the nav
                if (!selected) {
                    selected = getFirstSelectablePage(privstructure) || getFirstSelectablePage(pubstructure);
                }
                if (selected) {
                    // update links in all menus with subnav with the selected page, so they wont trigger handleHashChange and cause weirdness
                    $('#lhnavigation_container').find('a.lhnavigation_toplevel_has_subnav').attr('href', '#l=' + selected);
                    // Select correct item
                    var menuitem = $('li[data-sakai-path=\'' + selected + '\']');
                    if (menuitem.length) {
                        if (selected.split('/').length > 1) {
                            var par = $('li[data-sakai-path=\'' + selected.split('/')[0] + '\']');
                            showHideSubnav(par, true);
                        }
                        var ref = menuitem.data('sakai-ref');
                        var savePath = menuitem.data('sakai-savepath') || false;
                        var pageSavePath = menuitem.data('sakai-pagesavepath') || false;
                        var canEdit = menuitem.data('sakai-submanage') || false;
                        var nonEditable = menuitem.data('sakai-noneditable') || false;
                        if (!menuitem.hasClass(navSelectedItemClass)) {
                            selectNavItem(menuitem, $(navSelectedItem));
                        }

                        getPageContent(ref, function() {
                            preparePageRender(ref, selected, savePath, pageSavePath, nonEditable, canEdit, newPageMode);
                        });
                    }
                } else {
                    renderPageUnavailable();
                }
            }
        };

        var preparePageRender = function(ref, path, savePath, pageSavePath, nonEditable, canEdit, newPageMode) {
            var content = returnStructure(ref);
            var pageContent = content ? content : sakai.config.defaultSakaiDocContent;
            var lastModified = content && content._lastModified ? content._lastModified : null;
            var autosave = content && content.autosave ? content.autosave : null;
            var pageTitle = $.trim($('.lhnavigation_selected_item .lhnavigation_page_title_value').text());
            var saveRef = ref;
            if (saveRef.indexOf('-') !== -1) {
                saveRef = saveRef.substring(saveRef.indexOf('-') + 1);
            }
            currentPageShown = {
                'ref': ref,
                'path': path,
                'content': pageContent,
                'savePath': savePath,
                'pageSavePath': pageSavePath,
                'saveRef': saveRef,
                'canEdit': canEdit,
                'nonEditable': nonEditable,
                '_lastModified': lastModified,
                'autosave': autosave,
                'title': pageTitle
            };
            if (newPageMode) {
                $(window).trigger('editpage.contentauthoring.sakai', [currentPageShown, newPageMode]);
                contextMenuHover = {
                    path: currentPageShown.path,
                    ref: currentPageShown.ref,
                    pageSavePath: currentPageShown.pageSavePath,
                    savePath: currentPageShown.savePath,
                    content: currentPageShown.content
                };
                editPageTitle();
                $(window).on('click', '#inserterbar_action_add_page', addNewPage);
            } else {
                $(window).trigger('showpage.contentauthoring.sakai', [currentPageShown]);
            }
        };

        /////////////////////////
        // Contextual dropdown //
        /////////////////////////

        var contextMenuHover = false;

        var onContextMenuHover = function($el, $elLI) {
            $('.lhnavigation_selected_submenu').hide();
            $('#lhnavigation_submenu').hide();
            if ($elLI.data('sakai-manage') && !$elLI.data('sakai-reorder-only')) {
                var additionalOptions = $elLI.data('sakai-addcontextoption');
                if (additionalOptions === 'world') {
                    $('#lhnavigation_submenu_profile').attr('href', '/content#p=' + sakai.api.Util.safeURL($elLI.data('sakai-pagesavepath').substring(3)));
                    $('#lhnavigation_submenu_profile_li').show();
                    $('#lhnavigation_submenu_permissions_li').show();
                } else if (additionalOptions === 'user') {
                    $('#lhnavigation_submenu li').hide();
                    $('#lhnavigation_submenu_user_permissions_li').show();
                } else {
                    $('#lhnavigation_submenu_profile_li').hide();
                    $('#lhnavigation_submenu_permissions_li').hide();
                }
                contextMenuHover = {
                    path: $elLI.data('sakai-path'),
                    ref: $elLI.data('sakai-ref'),
                    pageSavePath: $elLI.data('sakai-pagesavepath'),
                    savePath: $elLI.data('sakai-savepath')
                };
                $('.lhnavigation_selected_submenu', $el).show();
            }
        };

        var onContextMenuLeave = function() {
            if (!$('#lhnavigation_submenu').is(':visible')) {
                $('.lhnavigation_selected_submenu').hide();
                $('.lhnavigation_selected_submenu_image').removeClass('clicked');
            }
        };

        var showContextMenu = function($clickedItem){
            var contextMenu = $('#lhnavigation_submenu');
            $clickedItem.children('.lhnavigation_selected_submenu_image').addClass('clicked');
            var leftOffset = 68;
            if ($clickedItem.parents('.lhnavigation_subnav_item').attr('data-sakai-addcontextoption') === 'user') {
                leftOffset = 63;
            }
            contextMenu.css('left', $clickedItem.position().left + leftOffset + 'px');
            contextMenu.css('top', $clickedItem.position().top + 6 + 'px');
            toggleContextMenu();
        };

        var toggleContextMenu = function(forceHide) {
            var contextMenu = $('#lhnavigation_submenu');
            if (forceHide) {
                $('.lhnavigation_selected_submenu_image.clicked')
                    .parents('.lhnavigation_item_content, .lhnavigation_subnav_item_content')
                    .find('a:first').focus();
                $('.lhnavigation_selected_submenu_image').removeClass('clicked');
                contextMenu.hide();
            } else {
                contextMenu.toggle();
                contextMenu.find('a:visible:first').focus();
            }
        };

        //////////////////////
        // Area permissions //
        //////////////////////

        var showAreaPermissions = function() {
            toggleContextMenu(true);
            $(window).trigger('permissions.area.trigger', [contextMenuHover]);
        };

        //////////////////////
        // User permissions //
        //////////////////////

        var showUserPermissions = function() {
            toggleContextMenu(true);
            $(window).trigger('permissions.area.trigger', [contextMenuHover]);
        };

        //////////////////////////////////
        // Adding a new page or subpage //
        //////////////////////////////////

        /**
         * Update the docstructure in memory
         *
         * @param {String} contentUrl The URL for the piece of content
         * @param {Function} callback The callback function upon completion
         */
        var updateDocStructure = function(contentUrl, callback) {
            // grab new structure0 in case it has been modified
            // add the new page to it
            // save structure0
            $.ajax({
                url: contentUrl + '.infinity.json',
                cache: false,
                success: function(data) {
                    if (data && _.isString(data.structure0)) {
                        data.structure0 = $.parseJSON(data.structure0);
                    }
                    sakaiDocsInStructure[contentUrl] = data;
                    sakaiDocsInStructure[contentUrl].orderedItems =
                        orderItems(sakaiDocsInStructure[contentUrl].structure0);
                    if ($.isFunction(callback)) {
                        callback(true);
                    }
                },
                error: function() {
                    if ($.isFunction(callback)) {
                        callback(false);
                    }
                }
            });
        };

        var addNewPage = function() {
            $(window).off('click', '#inserterbar_action_add_page', addNewPage);
            if (contextData.addArea) {
                addSubPage();
            } else {
                addTopPage();
            }
        };

        var addTopPage = function() {
            updateDocStructure(contextData.puburl, function(success) {
                if (success) {
                    var newpageid = sakai.api.Util.generateWidgetId();
                    var neworder = pubstructure.orderedItems.length;
        
                    var pageContent = {
                        'rows': [{
                            'id': 'id' + Math.round(Math.random() * 100000000),
                            'columns': [{
                                'width': 1,
                                'elements': []
                            }]
                        }]
                    };
                    var pageToCreate = {
                        '_ref': newpageid,
                        '_title': 'Untitled Page',
                        '_order': neworder,
                        '_canSubedit': true,
                        '_canEdit': true,
                        '_poolpath': currentPageShown.savePath,
                        'main': {
                            '_ref': newpageid,
                            '_order': 0,
                            '_title': 'Untitled Page',
                            '_childCount': 0,
                            '_canSubedit': true,
                            '_canEdit': true,
                            '_poolpath': currentPageShown.savePath
                        },
                        '_childCount':1
                    };
        
                    pubstructure.pages[newpageid] = pageContent;
                    sakaiDocsInStructure[contextData.puburl][newpageid] = pageContent;
        
                    pubstructure.items[newpageid] = pageToCreate;
                    pubstructure.items._childCount++;
                    sakaiDocsInStructure[currentPageShown.savePath].structure0[newpageid] = pageToCreate;
                    sakaiDocsInStructure[currentPageShown.savePath].orderedItems = orderItems(sakaiDocsInStructure[currentPageShown.savePath].structure0);
        
                    renderData();
                    addParametersToNavigation();
                    $(window).trigger('sakai.contentauthoring.needsTwoColumns');
                    sakai.api.Server.saveJSON(currentPageShown.savePath + '/' + newpageid + '/', pageContent, function() {
                        $.bbq.pushState({
                            'l': newpageid,
                            'newPageMode': 'true'
                        }, 0);
                        enableSorting();
                    }, true);
                }
            });
        };

        var addSubPage = function() {
            // grab new structure0 in case it has been modified
            // add the new page to it
            // save structure0
            updateDocStructure(currentPageShown.pageSavePath, function(success) {
                if (success) {
                    var newpageid = sakai.api.Util.generateWidgetId();
                    var neworder = sakaiDocsInStructure[currentPageShown.pageSavePath].orderedItems.length;
        
                    var fullRef = currentPageShown.pageSavePath.split('/p/')[1] + '-' + newpageid;
                    var basePath = currentPageShown.path.split('/')[0];
        
                    var pageContent = {
                        'rows': [{
                            'id': sakai.api.Util.generateWidgetId(),
                            'columns': [{
                                'width': 1,
                                'elements': []
                            }]
                        }]
                    };
                    var pageToCreate = {
                        '_ref': fullRef,
                        '_title': 'Untitled Page',
                        '_order': neworder,
                        '_canSubedit': true,
                        '_canEdit': true,
                        '_poolpath': currentPageShown.pageSavePath,
                        'main': {
                            '_ref': fullRef,
                            '_order': 0,
                            '_title': 'Untitled Page',
                            '_childCount': 0,
                            '_canSubedit': true,
                            '_canEdit': true,
                            '_poolpath': currentPageShown.pageSavePath
                        },
                        '_childCount':1
                    };
                    var pageToCreate1 = {
                        '_ref': newpageid,
                        '_title': 'Untitled Page',
                        '_order': neworder,
                        '_canSubedit': true,
                        '_canEdit': true,
                        '_poolpath': currentPageShown.pageSavePath,
                        'main': {
                            '_ref': newpageid,
                            '_order': 0,
                            '_title': 'Untitled Page',
                            '_childCount': 0,
                            '_canSubedit': true,
                            '_canEdit': true,
                            '_poolpath': currentPageShown.pageSavePath
                        },
                        '_childCount':1
                    };
        
                    pubstructure.pages[fullRef] = pageContent;
                    sakaiDocsInStructure[currentPageShown.pageSavePath][newpageid] = pageContent;
        
                    pubstructure.items[basePath][newpageid] = pageToCreate;
                    pubstructure.items[basePath]._childCount++;
        
                    sakaiDocsInStructure[currentPageShown.pageSavePath].structure0[newpageid] = pageToCreate1;
                    sakaiDocsInStructure[currentPageShown.pageSavePath].orderedItems = orderItems(sakaiDocsInStructure[currentPageShown.pageSavePath].structure0);

                    renderData();
                    addParametersToNavigation();

                    sakai.api.Server.saveJSON(currentPageShown.pageSavePath + '/' + newpageid + '/', pageContent, function() {
                        $(window).trigger('sakai.contentauthoring.needsTwoColumns');
                        $.bbq.pushState({
                            'l': currentPageShown.path.split('/')[0] +
                                    '/' + newpageid,
                            'newPageMode': 'true'
                        }, 0);
                        enableSorting();
                    }, true);
                }
            });
        };

        /////////////////////
        // Renaming a page //
        /////////////////////

        var changingPageTitle = false;

        var checkSaveEditPageTitle = function(ev) {
            $(document).off('click', checkSaveEditPageTitle);
            if (!$(ev.target).is('input') && changingPageTitle) {
                savePageTitle();
            }
        };

        var editPageTitle = function() {
            // Select correct item
            var menuitem = $('li[data-sakai-path=\'' + contextMenuHover.path + '\'] > div');
            changingPageTitle = jQuery.extend(true, {}, contextMenuHover);

            var pageTitle = $('.lhnavigation_page_title_value', menuitem);
            var inputArea = $('.lhnavigation_change_title', menuitem);
            inputArea.show();
            inputArea.val($.trim(pageTitle.text()));
            
            pageTitle.hide();

            // Hide the dropdown menu
            toggleContextMenu(true);
            inputArea.focus();
            inputArea.select();
            $(document).on('click', checkSaveEditPageTitle);
        };

        var savePageTitle = function() {
            var menuitem = $('li[data-sakai-path=\'' + changingPageTitle.path + '\'] > div');

            var inputArea = $('.lhnavigation_change_title', menuitem);
            inputArea.hide();

            var pageTitle = $('.lhnavigation_page_title_value', menuitem);
            pageTitle.text(inputArea.val());
            pageTitle.show();

            currentPageShown.title = $.trim(pageTitle.text());
            // Change main structure
            var mainPath = changingPageTitle.path;
            if (changingPageTitle.path.toString().indexOf('/') !== -1) {
                var parts = changingPageTitle.path.toString().split('/');
                mainPath = parts[1];
                pubstructure.items[parts[0]][parts[1]]._title = inputArea.val();
            } else {
                pubstructure.items[changingPageTitle.path]._title = inputArea.val();
            }
            // Look up appropriate doc and change that structure
            var structure = sakaiDocsInStructure[changingPageTitle.savePath];
            structure.structure0[mainPath]._title = inputArea.val();
            storeStructure(structure.structure0, changingPageTitle.savePath);

            changingPageTitle = false;
        };

        /////////////////////
        // Deleting a page //
        /////////////////////

        var pageToDelete = false;

        var deletePage = function() {
            // Look up appropriate doc and change that structure
            var structure = sakaiDocsInStructure[pageToDelete.savePath];
            var pageRef = pageToDelete.ref.toString();
            var pagePath = pageToDelete.path.toString();
            var realRef = pageRef;
            if (pageRef.indexOf('-') !== -1) {
                realRef = pageRef.split('-')[1];
            }
            var realPath = pagePath;
            if (pagePath.indexOf('/') !== -1) {
                realPath = pagePath.split('/')[1];
            }
            updateCountsAfterDelete(structure.structure0, structure, realRef, realPath);
            storeStructure(structure.structure0, pageToDelete.savePath);

            // Change the main structure
            updateCountsAfterDelete(pubstructure.items, pubstructure.pages, pageRef, pagePath);
            updatePageReference(pubstructure.items, pagePath);
            if (getPageCount(pubstructure.items) < 3) {
                $(window).trigger('sakai.contentauthoring.needsOneColumn');
            }

            // Delete the page
            var deletePath = pageToDelete.pageSavePath;
            if (pageToDelete.savePath.indexOf('/~') === -1) {
                // probably a sub page to delete
                deletePath = pageToDelete.pageSavePath + '/' + pageToDelete.ref.substr(pageToDelete.ref.indexOf('-') + 1);
            }
            sakai.api.Server.removeJSON(deletePath);

            // Re-render the navigation
            renderData();
            addParametersToNavigation();
            enableSorting();

            // Move away from the current page
            if (pagePath.indexOf('/') !== -1) {
                if (getPageCount(structure.structure0) < 3) {
                    $.bbq.pushState({
                        'l': pagePath.split('/')[0],
                        '_': Math.random(),
                        'newPageMode': ''
                    }, 0);
                } else {
                    var selected = getFirstSelectablePage(structure);
                    $.bbq.pushState({
                        'l': pagePath.split('/')[0] + '/' + selected,
                        '_': Math.random(),
                        'newPageMode': ''
                    }, 0);
                }
            } else {
                $.bbq.pushState({
                    'l': '',
                    '_': Math.random(),
                    'newPageMode': ''
                }, 0);
            }
            sakai.api.Util.Modal.close('#lhnavigation_delete_dialog');
        };

        /*
         * Update the page reference if it belonged to a subpage that was just deleted
         */
        var updatePageReference = function(structure, path) {
            if (path.indexOf('/') !== -1) {
                var parts = path.split('/');
                var checkRef = structure[parts[0]]._ref;
                if (checkRef.indexOf('-') !== -1) {
                    var newRef = false;
                    var checkRefPage = checkRef.split('-')[0];
                    var checkRefId = checkRef.split('-')[1];
                    // The page ref should be the first sub page
                    if (structure[parts[0]]._elements &&
                        structure[parts[0]]._elements[0] &&
                        structure[parts[0]]._elements[0].main &&
                        structure[parts[0]]._elements[0].main._ref &&
                        checkRefId !== structure[parts[0]]._elements[0].main._ref) {
                        if (structure[parts[0]]._elements[0].main._ref.indexOf(checkRefPage) !== -1) {
                            checkRefPage = '';
                        } else {
                            checkRefPage = checkRefPage + '-';
                        }
                        structure[parts[0]]._ref = checkRefPage + structure[parts[0]]._elements[0].main._ref;
                    }
                }
            }
        };

        var updateCountsAfterDelete = function(structure, pageslist, ref, path) {
            orderedItems = orderItems(structure);
            var oldOrder = 0;
            if (path.indexOf('/') !== -1) {
                var parts = path.split('/');
                oldOrder = structure[parts[0]][parts[1]]._order;
                delete structure[parts[0]][parts[1]];
                for (var i = 0; i < orderedItems.length; i++) {
                    if (orderedItems[i]._pid === ref.split('-')[0]) {
                        orderedItems[i]._elements.splice(oldOrder, 1);
                        orderedItems[i]._childCount--;
                        for (var o = oldOrder; o < orderedItems[i]._elements.length; o++) {
                            orderedItems[i]._elements[o]._order = o;
                            structure[orderedItems[i]._id][orderedItems[i]._elements[o]._id]._order = o;
                        }
                    }
                }
            } else {
                oldOrder = structure[path]._order;
                delete structure[path];
                orderedItems.splice(oldOrder, 1);
                for (var z = oldOrder; z < orderedItems.length; z++) {
                    orderedItems[z]._order = z;
                    structure[orderedItems[z]._id]._order = z;
                }
            }
            delete pageslist[ref];
        };

        var confirmPageDelete = function() {
            pageToDelete = jQuery.extend(true, {}, contextMenuHover);
            toggleContextMenu(true);
            sakai.api.Util.Modal.open('#lhnavigation_delete_dialog');
        };

        // Init delete dialog
        sakai.api.Util.Modal.setup('#lhnavigation_delete_dialog', {
            modal: true,
            overlay: 20,
            toTop: true
        });

        /////////////////////////////////////////////
        // Add additional parameters to navigation //
        /////////////////////////////////////////////

        var storeNavigationParameters = function(params) {
            for (var p in params) {
                parametersToCarryOver[p] = params[p];
            }
            addParametersToNavigation();
        };

        var addParametersToNavigation = function() {
            $('#lhnavigation_container a').each(function(index) {
                var oldHref =  $(this).attr('href');
                var newHref = sakai.api.Widgets.createHashURL(parametersToCarryOver, oldHref);
                $(this).attr('href', newHref);
            });
        };

        //////////////////////////////
        // Handle navigation clicks //
        //////////////////////////////

        var selectNavItem = function($clickedItem, $prevItem) {
            // Remove selected class from previous selected page
            $prevItem.removeClass(navSelectedItemClass);
            $prevItem.addClass(navHoverableItemClass);
            // Add selected class to currently selected page
            $clickedItem.removeClass(navHoverableItemClass);
            $clickedItem.addClass(navSelectedItemClass);
            // Open or close subnavigation if necessary
            showHideSubnav($clickedItem);
        };

        var processNavigationClick = function($el, ev) {
            // don't open if the click is a result of a sort operation
            var $elLI = $el.parent('li');
            if ($elLI.hasClass('lhnavigation_hassubnav') && !$(ev.target).hasClass('lhnavigation_selected_submenu_image')) {
                showHideSubnav($elLI);
            }
        };

        sakai.api.Util.hideOnClickOut('#lhnavigation_submenu', '.lhnavigation_selected_submenu_image');

        var showHideSubnav = function($el, forceOpen) {
            $el.children('.lhnavigation_selected_item_subnav').show();
            if ($el.hasClass('lhnavigation_hassubnav')) {
                if (!$el.children('ul:first').is(':visible') || forceOpen) {
                    $('.lhnavigation_has_subnav', $el).addClass('lhnavigation_has_subnav_opened');
                    $el.children('ul:first').show();
                } else {
                    $('.lhnavigation_has_subnav', $el).removeClass('lhnavigation_has_subnav_opened');
                    $el.children('ul:first').hide();
                }
            }
            $('.s3d-page-column-right').css('min-height', $('.s3d-page-column-left').height());
        };

        ////////////////////////////
        // Navigation re-ordering //
        ////////////////////////////

        var handleReorder = function(e, ui) {
            var $target = $(e.target);
            var savePath = $target.parents('.lhnavigation_menuitem:first').data('sakai-savepath');
            var structure = sakaiDocsInStructure[savePath];
            var $list = $target.parents('ul div.lhnavigation_menu_list');
            if ($target.parents('ul.lhnavigation_subnav').length) {
                $list = $target.parents('ul.lhnavigation_subnav');
            }
            var area = privstructure;
            if ($list.data('sakai-space') === 'public') {
                area = pubstructure;
            }
            $list.children('li').each(function(i, elt) {
                var path = ''+$(elt).data('sakai-path');
                var struct0path = path;
                if ($(elt).data('sakai-ref').indexOf('-') === -1) {
                    if (struct0path.indexOf('/') > -1) {
                        var split = struct0path.split('/');
                        structure.structure0[split[0]][split[1]]._order = i;
                    } else {
                        structure.structure0[struct0path]._order = i;
                    }
                } else {
                    if (struct0path.indexOf('/') > -1) {
                        struct0path = struct0path.split('/')[1];
                    }
                    structure.structure0[struct0path]._order = i;
                }
                var item = getPage(path, area.items);
                item._order = i;
            });
            storeStructure(structure.structure0, savePath);
            e.stopImmediatePropagation();
        };

        var enableSorting = function() {
            $('#lhnavigation_container .lhnavigation_menu_list').sortable({
                items: 'li.lhnavigation_outer[data-sakai-manage=true]',
                update: handleReorder,
                distance: 30
            });
            $('#lhnavigation_container .lhnavigation_subnav').sortable({
                items: 'li.lhnavigation_subnav_item[data-sakai-manage=true]',
                update: handleReorder,
                distance: 30
            });
            $('.lhnavigation_menuitem[data-sakai-manage=true]').addClass('lhnavigation_move_cursor');
        };

        //////////////////////////////////////
        // Prepare the navigation to render //
        //////////////////////////////////////

        var renderNavigation = function(pubdata, privdata, cData, mainPubUrl, mainPrivUrl) {
            cData.puburl = mainPubUrl;
            cData.privurl = mainPrivUrl;
            contextData = cData;
            processData(privdata, cData.privurl, function(processedPriv) {
                privstructure = processedPriv;
                processData(pubdata, cData.puburl, function(processedPub) {
                    pubstructure = processedPub;
                    renderData();
                    selectPage();
                    enableSorting();
                    if (cData.parametersToCarryOver) {
                        parametersToCarryOver = cData.parametersToCarryOver;
                        addParametersToNavigation();
                    }
                });
            });
            if (mainPubUrl) {
                sakaiDocsInStructure[mainPubUrl] = $.extend(true, {}, pubdata);
                sakaiDocsInStructure[mainPubUrl].orderedItems = orderItems(sakaiDocsInStructure[mainPubUrl].structure0);
            }
            if (mainPrivUrl) {
                sakaiDocsInStructure[mainPrivUrl] = $.extend(true, {}, privdata);
                sakaiDocsInStructure[mainPrivUrl].orderedItems = orderItems(sakaiDocsInStructure[mainPrivUrl].structure0);
            }
        };

        ///////////////////////////////////////
        // Initializing the Sakaidocs widget //
        ///////////////////////////////////////

        var sakaiDocsInitialized = false;

        var prepareRenderNavigation = function(pubdata, privdata, cData, mainPubUrl, mainPrivUrl) {
            if (!sakaiDocsInitialized) {
                sakaiDocsInitialized = true;
                $('#s3d-page-main-content').append($('#lhnavigation_contentauthoring_declaration'));
                $(window).bind('ready.contentauthoring.sakai', function() {
                    renderNavigation(pubdata, privdata, cData, mainPubUrl, mainPrivUrl);
                });
                // Don't render sakaidocs on paths in the doNotRenderSakaiDocsOnPaths array
                // so we don't double-render it on those that already include it
                if ($.inArray(window.location.path, doNotRenderSakaiDocsOnPaths) === -1) {
                    sakai.api.Util.TemplateRenderer($lhnavigation_contentauthoring_declaration_template, {}, $lhnavigation_contentauthoring_declaration);
                }
                sakai.api.Widgets.widgetLoader.insertWidgets('s3d-page-main-content', false);
            } else {
                renderNavigation(pubdata, privdata, cData, mainPubUrl, mainPrivUrl);
            }
        };

        sakai_global.lhnavigation.getCurrentPage = function() {
            return currentPageShown;
        };

        ////////////////////////////
        // Internal event binding //
        ////////////////////////////

        $('.lhnavigation_selected_submenu').live('click', function(ev) {
            showContextMenu($(this));
        });

        $rootel.on('mouseenter focus', '.lhnavigation_item_content, .lhnavigation_subnav_item_content', function() {
            onContextMenuHover($(this), $(this).parent('li'));
        });

        $(window).on('click', '#inserterbar_action_add_page', addNewPage);

        $('#lhavigation_submenu_edittitle').live('click', function(ev) {
            editPageTitle();
            ev.stopPropagation();
        });

        $('#lhnavigation_submenu_permissions').live('click', function(ev) {
            showAreaPermissions();
        });

        $('#lhnavigation_submenu_user_permissions').live('click', function(ev) {
            showUserPermissions();
        });

        $rootel.on('keydown', '.lhnavigation_change_title', function(ev) {
            if (ev.keyCode === 13 && changingPageTitle) {
                savePageTitle();
            }
        });

        $('.lhnavigation_change_title').live('blur', function(ev) {
            if (changingPageTitle) {
                savePageTitle();
            }
        });

        $('#lhavigation_submenu_deletepage').live('click', function(ev) {
            confirmPageDelete();
        });

        $('#lhnavigation_delete_confirm').live('click', function(ev) {
            deletePage();
        });

        $('.lhnavigation_item_content, .lhnavigation_subnav_item_content').live('mouseleave', function() {
            onContextMenuLeave();
        });

        $('.lhnavigation_item_content').live('click', function(ev) {
            processNavigationClick($(this), ev);
        });

        // bind arrow keys for navigation
        $('.lhnavigation_menuitem a').live('keydown', function(ev) {
            var $el = $(this);
            if (ev.which == $.ui.keyCode.DOWN) {
                // check top level
                if ($el.hasClass('lhnavigation_toplevel')) {
                    // check if sub menu open
                    if ($el.parent().nextAll('ul:visible').length) {
                        // step into sub menu
                        $el.parent().nextAll('ul:visible').children('li:first').find('a').focus();
                        return false;
                    }
                    // check if next top level menu item
                    else if ($el.parents('li.lhnavigation_menuitem').nextAll('li:first').children('div').children('a').length) {
                        $el.parents('li.lhnavigation_menuitem').nextAll('li:first').children('div').children('a').focus();
                        return false;
                    }
                    // check if next menu structure
                    else if ($el.parents('.lhnavigation_menu_list').nextAll('div:first').children('li:first').children('div').children('a').length) {
                        $el.parents('.lhnavigation_menu_list').nextAll('div:first').children('li:first').children('div').children('a').focus();
                        return false;
                    }
                }
                // check sub level
                else if ($el.parents('.lhnavigation_subnav_item').length) {
                    // check if next sub menu item
                    if ($el.parents('.lhnavigation_subnav_item').nextAll('li:first').length) {
                        $el.parents('.lhnavigation_subnav_item').nextAll('li:first').find('a').focus();
                        return false;
                    }
                    // find next top level menu item
                    else if ($el.parents('li.lhnavigation_menuitem').nextAll('li:first').children('div').children('a').length) {
                        $el.parents('li.lhnavigation_menuitem').nextAll('li:first').children('div').children('a').focus();
                        return false;
                    }
                    // find next menu structure
                    else if ($el.parents('.lhnavigation_menu_list').nextAll('div:first').children('li:first').children('div').children('a').length) {
                        $el.parents('.lhnavigation_menu_list').nextAll('div:first').children('li:first').children('div').children('a').focus();
                        return false;
                    }
                }
            } else if (ev.which == $.ui.keyCode.UP) {
                // check top level
                if ($el.hasClass('lhnavigation_toplevel')) {
                    // check if previous menu has an open sub menu open
                    if ($el.parents('li.lhnavigation_menuitem').prevAll('li:first').children('ul:visible').length) {
                        // step into sub menu
                        $el.parents('li.lhnavigation_menuitem').prevAll('li:first').children('ul:visible').children('li:last').find('a').focus();
                        return false;
                    }
                    // check if next top level menu item
                    else if ($el.parents('li.lhnavigation_menuitem').prevAll('li:first').children('div').children('a').length) {
                        $el.parents('li.lhnavigation_menuitem').prevAll('li:first').children('div').children('a').focus();
                        return false;
                    }
                    // check if next menu structure
                    else if ($el.parents('.lhnavigation_menu_list').prevAll('div:first').children('li:last').length) {
                        // check if sub menu open
                        if ($el.parents('.lhnavigation_menu_list').prevAll('div:first').children('li:last').children('ul:visible').length) {
                            $el.parents('.lhnavigation_menu_list').prevAll('div:first').children('li:last').children('ul:visible').children('li:last').find('a').focus();
                            return false;
                        } else if ($el.parents('.lhnavigation_menu_list').prevAll('div:first').children('li:last').children('div').children('a').length) {
                            $el.parents('.lhnavigation_menu_list').prevAll('div:first').children('li:last').children('div').children('a').focus();
                            return false;
                        }
                    }
                }
                // check sub level
                else if ($el.parents('.lhnavigation_subnav_item').length) {
                    // check if previous sub menu item
                    if ($el.parents('.lhnavigation_subnav_item').prevAll('li:first').length) {
                        $el.parents('.lhnavigation_subnav_item').prevAll('li:first').find('a').focus();
                        return false;
                    }
                    // find parent top level menu item
                    else if ($el.parents('ul.lhnavigation_subnav').prev('div').children('a').length) {
                        $el.parents('ul.lhnavigation_subnav').prev('div').children('a').focus();
                        return false;
                    }
                }
            } else if (ev.which == $.ui.keyCode.RIGHT &&
                    $el.prev('div').hasClass('lhnavigation_has_subnav') &&
                    !$el.prev('div').hasClass('lhnavigation_has_subnav_opened')) {
                // open sub menu
                $el.click();
            } else if (ev.which == $.ui.keyCode.LEFT &&
                    $el.prev('div').hasClass('lhnavigation_has_subnav_opened')) {
                // close sub menu
                $el.click();
            }
        });

        ////////////////////////////
        // External event binding //
        ////////////////////////////

        $(window).bind('lhnav.addHashParam', function(ev, params) {
            storeNavigationParameters(params);
        });
        var handleHashChange = function(e, changed, deleted, all, currentState, first) {
            if (!($.isEmptyObject(changed) && $.isEmptyObject(deleted))) {
                selectPage(all && all.newPageMode && all.newPageMode === 'true');
            }
        };
        $(window).bind('hashchanged.lhnavigation.sakai', handleHashChange);

        $(window).bind('lhnav.init', function(e, pubdata, privdata, cData, mainPubUrl, mainPrivUrl) {
            prepareRenderNavigation(pubdata, privdata, cData, mainPubUrl, mainPrivUrl);
        });

        $(window).bind('lhnav.updateCount', function(e, pageid, value, add) {
            updateCounts(pageid, value, add);
        });

        $(window).unload(function() {
            if($.bbq.getState('newPageMode')) {
                $.bbq.removeState('newPageMode');
            }
        });

        ///////////////////////
        // Widget has loaded //
        ///////////////////////

        $(window).trigger('lhnav.ready');

    };
    
    
    sakai_global.mylibrary = function (tuid, showSettings, widgetData, state) {

        /////////////////////////////
        // Configuration variables //
        /////////////////////////////

        var mylibrary = {  // global data for mylibrary widget
            sortBy: '_lastModified',
            sortOrder: 'desc',
            isOwnerViewing: false,
            default_search_text: '',
            userArray: [],
            contextId: false,
            infinityScroll: false,
            widgetShown: true,
            listStyle: 'list'
        };

        // DOM jQuery Objects
        var $rootel = $('#' + tuid);  // unique container for each widget instance
        var $mylibrary_check = $('.mylibrary_check', $rootel);
        var $mylibrary_items = $('#mylibrary_items', $rootel);
        var $mylibrary_check_all = $('#mylibrary_select_checkbox', $rootel);
        var $mylibrary_remove = $('#mylibrary_remove', $rootel);
        var $mylibrary_addto = $('#mylibrary_addpeople_button', $rootel);
        var $mylibrary_share = $('#mylibrary_content_share', $rootel);
        var $mylibrary_sortby = $('#mylibrary_sortby', $rootel);
        var $mylibrary_livefilter = $('#mylibrary_livefilter', $rootel);
        var $mylibrary_livefilter_container = $('#mylibrary_livefilter_container', $rootel);
        var $mylibrary_sortarea = $('#mylibrary_sortarea', $rootel);
        var $mylibrary_empty = $('#mylibrary_empty', $rootel);
        var $mylibrary_admin_actions = $('#mylibrary_admin_actions', $rootel);
        var $mylibrary_addcontent = $('#mylibrary_addcontent', $rootel);
        var $mylibrary_remove_icon = $('.mylibrary_remove_icon', $rootel);
        var $mylibrary_search_button = $('#mylibrary_search_button', $rootel);
        var $mylibrary_result_count = $('.s3d-search-result-count', $rootel);
        var $mylibrary_show_grid = $('.s3d-listview-grid', $rootel);
        var $mylibrary_show_list = $('.s3d-listview-list', $rootel);
        var $mylibraryAddContentOverlay = $('.sakai_add_content_overlay', $rootel);

        var currentGroup = false;

        ///////////////////////
        // Utility functions //
        ///////////////////////

        /**
         * Get personalized text for the given message bundle key based on
         * whether this library is owned by the viewer, or belongs to someone else.
         * The message should contain a '${firstname}' variable to replace with
         * and be located in this widget's properties files.
         *
         * @param {String} bundleKey The message bundle key
         */
        var getPersonalizedText = function (bundleKey) {
            if(currentGroup) {
                return sakai.api.i18n.getValueForKey(
                    bundleKey, 'mylibrary').replace(/\$\{firstname\}/gi,
                        currentGroup.properties['sakai:group-title']);
            } else if (mylibrary.isOwnerViewing) {
                return sakai.api.i18n.getValueForKey(
                    bundleKey, 'mylibrary').replace(/\$\{firstname\}/gi,
                        sakai.api.i18n.getValueForKey('YOUR').toLowerCase());
            } else {
                return sakai.api.i18n.getValueForKey(bundleKey, 'mylibrary').replace(/\$\{firstname\}/gi, sakai.api.User.getFirstName(sakai_global.profile.main.data) + '\'s');
            }
        };

        /**
         * Bring all of the topbar items (search, checkbox, etc.) back into its original state
         */
        var resetView = function() {
            $mylibrary_result_count.hide();
            $mylibrary_check_all.removeAttr('checked');
            $mylibrary_remove.attr('disabled', 'disabled');
            $mylibrary_addto.attr('disabled', 'disabled');
            $mylibrary_share.attr('disabled', 'disabled');
            $('#mylibrary_title_bar').show();
        };

        /**
         * Show or hide the controls on the top of the library (search box, sort, etc.)
         * @param {Object} show    True when you want to show the controls, false when
         *                         you want to hide the controls
         */
        var showHideTopControls = function(show) {
            if (show) {
                if (mylibrary.isOwnerViewing) {
                    $mylibrary_remove.show();
                    $mylibrary_admin_actions.show();
                    $mylibraryAddContentOverlay.show();
                }
                $('.s3d-page-header-top-row', $rootel).show();
                $mylibrary_livefilter_container.show();
                $mylibrary_sortarea.show();
            } else {
                $('.s3d-page-header-top-row', $rootel).hide();
                $mylibrary_admin_actions.hide();
                $mylibrary_livefilter_container.hide();
                $mylibrary_sortarea.hide();
            }
        };

        /**
         * Renders library title
         * @param {String} contextName The name to render
         * @param {Boolean} isGroup Flag if this is a groups library or not
         */
        var renderLibraryTitle = function(contextName, isGroup) {
            sakai.api.Util.TemplateRenderer('mylibrary_title_template', {
                isMe: mylibrary.isOwnerViewing,
                isGroup: isGroup,
                user: sakai.api.Util.Security.safeOutput(contextName)
            }, $('#mylibrary_title_container', $rootel));
        };

        /////////////////////////////
        // Deal with empty library //
        /////////////////////////////

        /**
         * Function that manages how a library with no content items is handled. In this case,
         * the items container will be hidden and a 'no items' container will be shown depending
         * on what the current context of the library is
         */
        var handleEmptyLibrary = function() {
            resetView();
            $mylibrary_items.hide();
            var query = $mylibrary_livefilter.val();
            // We only show the controls when there is a search query. 
            // All other scenarios with no items don't show the top controls
            if (!query) {
                showHideTopControls(false);
            } else {
                showHideTopControls(true);
            }
            // Determine the state of the current user in the current library
            var mode = 'user_me';
            if (sakai_global.profile && mylibrary.contextId !== sakai.data.me.user.userid) {
                mode = 'user_other';
            } else if (!sakai_global.profile && (mylibrary.isOwnerViewing || mylibrary.isMemberViewing)) {
                mode = 'group_manager_member';
            } else if (!sakai_global.profile) {
                mode = 'group';
            }
            $mylibrary_empty.html(sakai.api.Util.TemplateRenderer('mylibrary_empty_template', {
                mode: mode,
                query: query
            }));

            $('.s3d-page-header-bottom-row', $rootel).hide();

            $mylibrary_empty.show();
        };

        ////////////////////
        // Load a library //
        ////////////////////

        /**
         * Load the items of the current library and start an infinite scroll on
         * them
         */
        var showLibraryContent = function () {
            resetView();
            var query = $mylibrary_livefilter.val() || '*';
            // Disable the previous infinite scroll
            if (mylibrary.infinityScroll) {
                mylibrary.infinityScroll.kill();
            }
            // Set up the infinite scroll for the list of items in the library
            var sortOrder = mylibrary.sortOrder;
            if (mylibrary.sortOrder === 'modified') {
                sortOrder = 'desc';
            }
            mylibrary.infinityScroll = $mylibrary_items.infinitescroll(sakai.config.URL.POOLED_CONTENT_SPECIFIC_USER, {
                userid: mylibrary.contextId,
                sortOn: mylibrary.sortBy,
                sortOrder: sortOrder,
                q: query
            }, function(items, total) {
                if (total && query && query !== '*') {
                    $mylibrary_result_count.show();
                    var resultLabel = sakai.api.i18n.getValueForKey('RESULTS');
                    if (total === 1) {
                        resultLabel = sakai.api.i18n.getValueForKey('RESULT');
                    }
                    $mylibrary_result_count.children('.s3d-search-result-count-label').text(resultLabel);
                    $mylibrary_result_count.children('.s3d-search-result-count-count').text(total);
                }
                if(!sakai.data.me.user.anon) {
                    if(items.length !== 0) {
                        $('.s3d-page-header-top-row', $rootel).show();
                        $('.s3d-page-header-bottom-row', $rootel).show();
                    }
                } else {
                    if(items.length !== 0) {
                        $('.s3d-page-header-top-row', $rootel).show();
                    }
                }
                return sakai.api.Util.TemplateRenderer('mylibrary_items_template', {
                    'items': items,
                    'sakai': sakai,
                    'isMe': mylibrary.isOwnerViewing
                });
            }, handleEmptyLibrary, sakai.config.URL.INFINITE_LOADING_ICON, handleLibraryItems, function() {
                // Initialize content draggable
                sakai.api.Util.Draggable.setupDraggable({}, $mylibrary_items);
            }, sakai.api.Content.getNewList(mylibrary.contextId));
        };

        ////////////////////
        // State handling //
        ////////////////////

        /**
         * Deal with changed state in the library. This can be triggered when
         * a search was initiated, sort was changed, etc.
         */
        var handleHashChange = function(e) {
            var ls = $.bbq.getState('ls') || 'list';
            $('.s3d-listview-options', $rootel).find('div').removeClass('selected');
            if (ls === 'list') {
                $('#mylibrary_items', $rootel).removeClass('s3d-search-results-grid');
                $mylibrary_show_list.addClass('selected');
                $mylibrary_show_list.children().addClass('selected');
                mylibrary.listStyle = 'list';
            } else if (ls === 'grid') {
                $('#mylibrary_items', $rootel).addClass('s3d-search-results-grid');
                $('.s3d-listview-options', $rootel).find('div').removeClass('selected');
                $mylibrary_show_grid.addClass('selected');
                $mylibrary_show_grid.children().addClass('selected');
                mylibrary.listStyle = 'grid';
            }

            if (mylibrary.widgetShown) {
                // Set the sort states
                var parameters = $.bbq.getState();
                mylibrary.sortOrder = parameters.lso || 'modified';
                mylibrary.sortBy = parameters.lsb || '_lastModified';
                $mylibrary_livefilter.val(parameters.lq || '');
                $mylibrary_sortby.val(mylibrary.sortOrder);
                showLibraryContent();
            }
        };

        ////////////////////
        // Search library //
        ////////////////////

        /**
         * Search the current library. This function will extract the query
         * from the search box directly.
         */
        var doSearch = function() {
            var q = $.trim($mylibrary_livefilter.val());
            if (q) {
                $.bbq.pushState({ 'lq': q });
            } else {
                $.bbq.removeState('lq');
            }
        };

        var updateButtonData = function() {
            var shareIdArr = [];
            var addToIdArr = [];
            var addToTitleArr = [];
            $.each($('.mylibrary_check:checked:visible', $rootel), function(i, checked) {
                addToIdArr.push($(checked).attr('data-entityid'));
                addToTitleArr.push($(checked).attr('data-entityname'));
                shareIdArr.push($(checked).attr('data-entityid'));
                if (!$(checked).attr('data-canshare-error')) {
                    $(checked).attr('data-canshare-error', 'true');
                }
            });
            $mylibrary_share.attr('data-entityid', shareIdArr);
            $mylibrary_addto.attr('data-entityid', addToIdArr);
            $mylibrary_addto.attr('data-entityname', addToTitleArr);
            if (!shareIdArr.length) {
                $mylibrary_share.attr('disabled', 'disabled');
            }
        };

        ////////////////////
        // Event Handlers //
        ////////////////////

        var addBinding = function() {
            /**
             * Enable/disable the remove selected button depending on whether
             * any items in the library are checked
             */
            $mylibrary_check.live('change', function (ev) {
                if ($(this).is(':checked')) {
                    $mylibrary_remove.removeAttr('disabled');
                    $mylibrary_addto.removeAttr('disabled');
                    $mylibrary_share.removeAttr('disabled');
                } else if (!$('.mylibrary_check:checked', $rootel).length) {
                    $mylibrary_remove.attr('disabled', 'disabled');
                    $mylibrary_addto.attr('disabled', 'disabled');
                    $mylibrary_share.attr('disabled', 'disabled');
                }
                updateButtonData();
            });

            /**
             * Check/uncheck all loaded items in the library
             */
            $mylibrary_check_all.change(function (ev) {
                if ($(this).is(':checked')) {
                    $('.mylibrary_check').attr('checked', 'checked');
                    $mylibrary_remove.removeAttr('disabled');
                    $mylibrary_addto.removeAttr('disabled');
                    $mylibrary_share.removeAttr('disabled');
                } else {
                    $('.mylibrary_check').removeAttr('checked');
                    $mylibrary_remove.attr('disabled', 'disabled');
                    $mylibrary_addto.attr('disabled', 'disabled');
                    $mylibrary_share.attr('disabled', 'disabled');
                }
                updateButtonData();
            });

            /**
             * Gather all selected library items and initiate the
             * deletecontent widget
             */
            $mylibrary_remove.click(function (ev) {
                var $checked = $('.mylibrary_check:checked:visible', $rootel);
                if ($checked.length) {
                    var paths = [];
                    var collectionPaths = [];
                    $checked.each(function () {
                        paths.push($(this).data('entityid'));
                        if($checked.attr('data-type') === 'x-sakai/collection') {
                            collectionPaths.push($(this).data('entityid'));
                        }
                    });
                    $(window).trigger('init.deletecontent.sakai', [{
                        paths: paths,
                        context: mylibrary.contextId
                    }, function (success) {
                        if (success) {
                            resetView();
                            $(window).trigger('lhnav.updateCount', ['library', -(paths.length)]);
                            mylibrary.infinityScroll.removeItems(paths);
                            if(collectionPaths.length) {
                                $(window).trigger('sakai.mylibrary.deletedCollections', {
                                    items: collectionPaths
                                });
                            }
                        }
                    }]);
                }
            });

            /**
             * Called when clicking the remove icon next to an individual content
             * item
             */
            $mylibrary_remove_icon.live('click', function(ev) {
                if ($(this).attr('data-entityid')) {
                    var paths = [];
                    var collection = false;
                    if($(this).attr('data-type') === 'x-sakai/collection') {
                        collection = true;
                    }
                    paths.push($(this).attr('data-entityid'));
                    $(window).trigger('init.deletecontent.sakai', [{
                        paths: paths,
                        context: mylibrary.contextId
                    }, function (success) {
                        if (success) {
                            resetView();
                            $(window).trigger('lhnav.updateCount', ['library', -(paths.length)]);
                            if(collection) {
                                $(window).trigger('sakai.mylibrary.deletedCollections', {
                                    items: paths
                                });
                            }
                            mylibrary.infinityScroll.removeItems(paths);
                        }
                    }]);
                }
            });

            /**
             * Reload the library list based on the newly selected
             * sort option
             */
            $mylibrary_sortby.change(function (ev) {
                var query = $.trim($mylibrary_livefilter.val());
                var sortSelection = $(this).val();
                if (sortSelection === 'desc') {
                    mylibrary.sortOrder = 'desc';
                    mylibrary.sortBy = 'filename';
                } else if (sortSelection === 'asc') {
                    mylibrary.sortOrder = 'asc';
                    mylibrary.sortBy = 'filename';
                } else {
                    mylibrary.sortOrder = 'modified';
                    mylibrary.sortBy = '_lastModified';
                }
                $.bbq.pushState({'lsb': mylibrary.sortBy, 'lso': mylibrary.sortOrder, 'lq': query});
            });

            /**
             * Initiate a library search when the enter key is pressed
             */
            $mylibrary_livefilter.keyup(function (ev) {
                if (ev.keyCode === 13) {
                    doSearch();
                }
                return false;
            });

            /**
             * Initiate a search when the search button next to the search
             * field is pressed
             */
            $mylibrary_search_button.click(doSearch);

            /**
             * Initiate the add content widget
             */
            $mylibrary_addcontent.click(function (ev) {
                $(window).trigger('init.newaddcontent.sakai');
                return false;
            });

            /**
             * An event to listen from the worldsettings dialog so that we can refresh the title if it's been changed.
             * @param {String} title     New group name
             */
            $(window).on('updatedTitle.worldsettings.sakai', function(e, title) {
                renderLibraryTitle(title, true);
            });

            /**
             * Listen for newly the newly added content or newly saved content
             * @param {Object} data        Object that contains the new library items
             * @param {Object} library     Context id of the library the content has been added to
             */
            $(window).bind('done.newaddcontent.sakai', function(e, data, library) {
                if (library === mylibrary.contextId || mylibrary.contextId === sakai.data.me.user.userid) {
                    mylibrary.infinityScroll.prependItems(data);
                }
            });

            /**
             * Keep track as to whether the current library widget is visible or not. If the
             * widget is not visible, it's not necessary to respond to hash change events.
             */
            $(window).bind(tuid + '.shown.sakai', function(e, shown) {
                mylibrary.widgetShown = shown;
            });
            /**
             * Bind to hash changes in the URL
             */
            $(window).bind('hashchange', handleHashChange);

            $mylibrary_show_list.click(function() {
                $.bbq.pushState({'ls': 'list'});
            });

            $mylibrary_show_grid.click(function() {
                $.bbq.pushState({'ls': 'grid'});
            });
        };

        ////////////////////////////////////////////
        // Data retrieval and rendering functions //
        ////////////////////////////////////////////

        /**
         * Process library item results from the server
         */
        var handleLibraryItems = function (results, callback) {
            sakai.api.Content.prepareContentForRender(results, sakai.data.me, function(contentResults) {
                if (contentResults.length > 0) {
                    callback(contentResults);
                    showHideTopControls(true);
                    $mylibrary_empty.hide();
                    $mylibrary_items.show();
                } else {
                    callback([]);
                }
            });
        };

        /////////////////////////////
        // Initialization function //
        /////////////////////////////

        var initGroupLibrary = function() {
            sakai.api.Server.loadJSON('/system/userManager/group/' +  mylibrary.contextId + '.json', function(success, data) {
                if (success) {
                    currentGroup = data;
                    var contextName = currentGroup.properties['sakai:group-title'];
                    mylibrary.isOwnerViewing = sakai.api.Groups.isCurrentUserAManager(currentGroup.properties['sakai:group-id'], sakai.data.me, currentGroup.properties);
                    mylibrary.isMemberViewing = sakai.api.Groups.isCurrentUserAMember(currentGroup.properties['sakai:group-id'], sakai.data.me);
                    finishInit(contextName, true);
                }
            });
        };

        var initUserLibrary = function() {
            mylibrary.contextId = sakai_global.profile.main.data.userid;
            var contextName = sakai.api.User.getFirstName(sakai_global.profile.main.data);
            if (mylibrary.contextId === sakai.data.me.user.userid) {
                mylibrary.isOwnerViewing = true;
            }
            finishInit(contextName, false);
        };

        /**
         * Initialization function that is run when the widget is loaded. Determines
         * which mode the widget is in (settings or main), loads the necessary data
         * and shows the correct view.
         */
        var doInit = function () {
            mylibrary.contextId = '';

            // We embed the deletecontent widget, so make sure it's loaded
            sakai.api.Widgets.widgetLoader.insertWidgets(tuid, false);

            if (widgetData && widgetData.mylibrary) {
                mylibrary.contextId = widgetData.mylibrary.groupid;
                initGroupLibrary();
            } else if (sakai_global.group && sakai_global.group.groupId) {
                mylibrary.contextId = sakai_global.group.groupId;
                initGroupLibrary();
            } else {
                initUserLibrary();
            }
        };

        /**
         * Additional set-up of the widget
         */
        var finishInit = function(contextName, isGroup) {
            if (mylibrary.contextId) {
                mylibrary.default_search_text = getPersonalizedText('SEARCH_YOUR_LIBRARY');
                mylibrary.currentPagenum = 1;
                mylibrary.listStyle = $.bbq.getState('ls') || 'list';
                handleHashChange(null, true);
                renderLibraryTitle(contextName, isGroup);
            } else {
                debug.warn('No user found for My Library');
            }
            addBinding();
        };

        // run the initialization function when the widget object loads
        doInit();

    };
    
    
    sakai_global.newaddcontent = function(tuid, showSettings) {

        /////////////////////////////
        // CONFIGURATION VARIABLES //
        /////////////////////////////

        // Containers
        var $newaddcontentContainer = $('#newaddcontent_container');
        var $newaddcontentContainerNewItem = $('#newaddcontent_container_newitem');
        var $newaddcontentContainerSelectedItemsContainer = $('#newaddcontent_container_selecteditems_container');
        var $newaddcontentSelecteditemsEditDataContainer = $('#newaddcontent_selecteditems_edit_data_container');
        var newaddcontentSelecteditemsEditDataContainer = '#newaddcontent_selecteditems_edit_data_container';
        var $newaddcontentSelectedItemsEditPermissionsContainer = $('#newaddcontent_selecteditems_edit_permissions_container');
        var newaddcontentSelectedItemsEditPermissionsContainer = '#newaddcontent_selecteditems_edit_permissions_container';
        var $newaddcontentNewItemContainer = $('.newaddcontent_newitem_container');

        // Templates
        var newaddcontentUploadContentTemplate = '#newaddcontent_upload_content_template';
        var newaddcontentAddDocumentTemplate = '#newaddcontent_add_document_template';
        var newaddcontentExistingItemsListContainerList = '#newaddcontent_existingitems_list_container_list';
        var newaddcontentAddLinkTemplate = '#newaddcontent_add_link_template';
        var newaddcontentAddExistingTemplate = '#newaddcontent_add_existing_template';
        var newaddcontentSelectedItemsTemplate = 'newaddcontent_selecteditems_template';
        var newaddcontentSelectedItemsEditPermissionsTemplates = 'newaddcontent_selecteditems_edit_permissions_template';
        var newaddcontentSelectedItemsEditDataTemplate = 'newaddcontent_selecteditems_edit_data_template';
        var newaddcontentExistingItemsTemplate = 'newaddcontent_existingitems_template';

        // Elements
        var $newaddcontentContainerLHChoiceItem = $('.newaddcontent_container_lhchoice_item');
        var newaddcontentContainerLHChoiceSelectedSubitem = '.newaddcontent_container_lhchoice_selected_subitem';
        var $newaddcontentContainerLHChoiceSubItem = $('.newaddcontent_container_lhchoice_subitem');
        var $newaddcontentContainerNewItemAddToList = $('.newaddcontent_container_newitem_add_to_list');
        var newaddcontentContainerStartUploadButton = '.newaddcontent_container_start_upload';
        var newaddcontentSelectedItemsRemove = '.newaddcontent_selecteditems_remove';
        var newaddcontentSelectedItemsActionsEdit = '.newaddcontent_selecteditems_actions_edit';
        var newaddcontentSelectedItemsActionsPermissions = '.newaddcontent_selecteditems_actions_permissions';
        var newaddcontentSelectedItemsEditDataClose = '.newaddcontent_selecteditems_edit_data_close';
        var newaddcontentContainerNewItemSaveChanges = '.newaddcontent_container_newitem_save_changes';
        var newaddcontentSelectedItemsEditIndex = '.newaddcontent_selecteditems_edit_index';
        var $newaddcontentContainerNewItemRaquoRight = $('#newaddcontent_container_newitem_raquo_right');
        var $newaddcontentExistingItemsSearch = $('.newaddcontent_existingitems_search');
        var newaddcontentAddLinkURL = '#newaddcontent_add_link_url';
        var newaddcontentAddLinkTitle = '#newaddcontent_add_link_title';
        var newaddcontentAddLinkDescription = '#newaddcontent_add_link_description';
        var newaddcontentAddLinkTags = '#newaddcontent_add_link_tags';
        var newaddcontentUploadContentOriginalTitle = '.newaddcontent_upload_content_originaltitle';
        var newaddcontentUploadContentTitle = '#newaddcontent_upload_content_title';
        var newaddcontentUploadContentDescription = '#newaddcontent_upload_content_description';
        var newaddcontentUploadContentTags = '#newaddcontent_upload_content_tags';
        var newaddcontentUploadContentPermissions = '#newaddcontent_upload_content_permissions';
        var newaddcontentAddDocumentTitle = '#newaddcontent_add_document_title';
        var newaddcontentAddDocumentPermissions = '#newaddcontent_add_document_permissions';
        var newaddcontentAddDocumentDescription = '#newaddcontent_add_document_description';
        var newaddcontentAddDocumentTags = '#newaddcontent_add_document_tags';
        var newaddcontentExistingItemsListContainerListItemIcon = '.newaddcontent_existingitems_list_container_list_item_icon';
        var newaddcontentExistingItemsListContainerActionsSort = '#newaddcontent_existingitems_list_container_actions_sort';
        var newaddcontentExistingItemsListContainerCheckboxes = '#newaddcontent_existingitems_list_container input[type=\'checkbox\']';
        var newaddcontentSelectedItemsEditDataTitle = '#newaddcontent_selecteditems_edit_data_title';
        var newaddcontentSelectedItemsEditDataDescription = ' #newaddcontent_selecteditems_edit_data_description';
        var newaddcontentSelectedItemsEditDataTags = ' #newaddcontent_selecteditems_edit_data_tags';
        var newaddcontentSelectedItemsEditPermissionsPermissions = '#newaddcontent_selecteditems_edit_permissions_permissions';
        var newaddcontentSelectedItemsEditPermissionsCopyright = '#newaddcontent_selecteditems_edit_permissions_copyright';
        var newaddcontentUploadContentFields = '#newaddcontent_upload_content_fields';
        var newaddcontentSaveTo = '#newaddcontent_saveto';
        var newaddcontentAddExistingSearchButton = '#newaddcontent_add_existing_template .s3d-search-button';
        var newaddcontentSelectedItemsEditDataForm = '#newaddcontent_selecteditems_edit_data_form';

        // Classes
        var newaddcontentContainerLHChoiceSelectedItem = 'newaddcontent_container_lhchoice_selected_item';
        var newaddcontentContainerLHChoiceItemClass = 'newaddcontent_container_lhchoice_item';
        var newaddcontentContainerNewItemExtraRoundedBorderClass = 'newaddcontent_container_newitem_extraroundedborder';
        var newaddcontentContainerLHChoiceSelectedSubitemClass = 'newaddcontent_container_lhchoice_selected_subitem';
        var newaddcontentContainerNewItemRaquoRightDocumentsposition = 'newaddcontent_container_newitem_raquo_right_documentsposition';
        var newaddcontentContainerNewItemAddToListDocumentsposition = 'newaddcontent_container_newitem_add_to_list_documentsposition';
        var newaddcontentContainerNewItemAddToListExistingContentposition = 'newaddcontent_container_newitem_add_to_list_existingcontentposition';
        var newaddcontentContainerNewItemAddToListUploadNewContent = 'newaddcontent_container_newitem_add_to_list_upload_new_content';
        var newaddcontentContainerNewItemAddToListAddLink = 'newaddcontent_container_newitem_add_to_list_add_link';
        var newaddcontentExistingItemsListContainerDisabledListItem = 'newaddcontent_existingitems_list_container_disabled_list_item';

        // List Variables
        var itemsToUpload = [];
        var itemsUploaded = 0;
        var brandNewContent = {};
        var allNewContent = [];
        var lastUpload = [];
        var existingAdded = [];
        var libraryToUploadTo = '';
        // Keep track of number of files in the upload list selected by browsing the OS
        // This number will later be used to check against the multifile list of uploads to avoid bug (https://jira.sakaiproject.org/browse/SAKIII-3269)
        var numberOfBrowsedFiles = 0;
        var $autoSuggestElt = false,
            $autoSuggestListCatElt = false,
            autoSuggestElts = {},
            $editAutoSuggestElt = false,
            $editAutoSuggestListCatElt = false;

        // Paths
        var uploadPath = '/system/pool/createfile';

        // Forms
        var $newaddcontentUploadContentForm = $('#newaddcontent_upload_content_form');
        var newAddContentForm = '.newaddcontent_form';
        var newaddcontentAddLinkForm = '#newaddcontent_add_link_form';
        var $newaddcontentAddLinkForm = $('#newaddcontent_add_link_form');
        var newaddcontentExistingContentForm = '#newaddcontent_existing_content_form';
        var newaddcontentAddDocumentForm = '#newaddcontent_add_document_form';
        var newaddcontentExistingCheckAll = '#newaddcontent_existingitems_list_container_actions_checkall';

        var multifileQueueAddAllowed = true;
        var contentUploaded = false;
        var hideAfterContentUpload = false;
        var currentExistingContext = false;

        var currentSelectedLibrary = sakai.data.me.user.userid;

        ////////////////////////////////
        // Get newly uploaded content //
        ////////////////////////////////

        sakai_global.newaddcontent.getNewContent = function(library) {
            var newContentLibrary = [];
            // grab all of the newly uploaded content, regardless of target library
            if (!library) {
                newContentLibrary = allNewContent;
            } else if (brandNewContent[library]) {
                newContentLibrary = brandNewContent[library];
            }
            // return a copy
            return $.merge([], newContentLibrary);
        };

        var deleteContent = function(e, paths) {
            if (paths && paths.length) {
                $.each(paths, function(i, path) {
                    $.each(allNewContent, function(j, newContent) {
                        if (newContent && newContent._path === path) {
                            allNewContent.splice(j,1);
                        }
                    });
                    $.each(brandNewContent, function(lib, items) {
                        $.each(items, function(k, item) {
                            if (item && item._path === path) {
                                items.splice(k,1);
                            }
                        });
                    });
                });
            }
        };

        /////////////////
        // ITEMS QUEUE //
        /////////////////

        /**
         * Following 4 functions enable or disable the buttons that
         *  - add items to the queue
         *  - upload items to the repository
         */
        var enableAddToQueue = function() {
            $newaddcontentContainerNewItemAddToList.removeAttr('disabled');
        };

        var disableAddToQueue = function() {
            $newaddcontentContainerNewItemAddToList.attr('disabled','disabled');
        };

        var enableStartUpload = function() {
            $(newaddcontentContainerStartUploadButton).removeAttr('disabled');
        };

        var disableStartUpload = function() {
            $(newaddcontentContainerStartUploadButton).attr('disabled','disabled');
        };

        /**
         * Render the queue
         */
        var renderQueue = function() {
            $newaddcontentContainerSelectedItemsContainer.html(sakai.api.Util.TemplateRenderer(newaddcontentSelectedItemsTemplate, {
                'items': itemsToUpload,
                'sakai': sakai,
                'me': sakai.data.me,
                'groups': sakai.api.Groups.getMemberships(sakai.data.me.groups, true),
                'currentSelectedLibrary': currentSelectedLibrary
            }));
        };

        var greyOutExistingInLibrary = function() {
            currentSelectedLibrary = $(newaddcontentSaveTo).val();
            renderQueue();
        };

        var resetQueue = function() {
            itemsToUpload = [];
            itemsUploaded = 0;
            disableAddToQueue();
            renderQueue();
            $('#newaddcontent_container input, #newaddcontent_container textarea').val('');
            $('.MultiFile-remove').click();
        };

        /**
         * Add an item to the queue
         * @param {Object} contentToAdd Object containing data about the object to be added to the queue
         * @param {Boolean} disableRender Disable rendering of the queue.
         */
        var addContentToQueue = function(contentToAdd, disableRender) {
            itemsToUpload.push(contentToAdd);
            disableAddToQueue();
            enableStartUpload();
            if (!disableRender) {
                renderQueue();
            }
        };

        /**
         * Remove an item from the queue
         */
        var removeItemToAdd = function() {
            $newaddcontentSelectedItemsEditPermissionsContainer.hide();
            $newaddcontentSelecteditemsEditDataContainer.hide();

            var index = $(this).parent()[0].id.split('newaddcontent_selecteditems_')[1];
            var obj = itemsToUpload[index];

            switch (obj.type) {
                case 'content':
                    var $found = $('*:contains(\'' + obj.originaltitle + '\')');
                    $found.last().prev('a').click();
                    // If the user removes an item that was selected through browsing the OS reduce the file count to avoid bug (https://jira.sakaiproject.org/browse/SAKIII-3269)
                    if(obj.origin == 'user') {
                        numberOfBrowsedFiles--;
                    }
                    break;
                case 'existing':
                    var $existing = $('input#' + obj['_path']);
                    $existing.removeAttr('disabled');
                    $existing.removeAttr('checked');
                    $existing.parent().removeClass(newaddcontentExistingItemsListContainerDisabledListItem);
                    break;
            }

            itemsToUpload.splice(index,1);

            if (!itemsToUpload.length) {
                disableStartUpload();
            }

            renderQueue();
        };

        /**
         * Construct an item to add to the queue
         * Depending on the type of the item to add construct a different object
         */
        var constructItemToAdd = function() {
            var uniqueId = sakai.api.Util.generateWidgetId();
            var tags = sakai.api.Util.AutoSuggest.getTagsAndCategories($autoSuggestElt, true);
            var $thisForm = $(this).parents($newaddcontentNewItemContainer).children(newAddContentForm);
            if ($(this).attr('id') === 'newaddcontent_container_newitem_raquo_right') {
                $thisForm = $(this).prev().children(':visible').find(newAddContentForm);
            }

            switch ($thisForm.attr('id')) {

                //////////////////////////
                // Uploading a new file //
                //////////////////////////

                case 'newaddcontent_upload_content_form':
                    var originalTitle = $thisForm.find(newaddcontentUploadContentOriginalTitle)[0].id;

                    // Calculate the file extension
                    var splitOnDot = originalTitle.split('.');
                    var contentObj = {
                        'sakai:pooled-content-file-name': $thisForm.find(newaddcontentUploadContentTitle).val(),
                        'sakai:description': $thisForm.find(newaddcontentUploadContentDescription).val(),
                        'sakai:permissions': $thisForm.find(newaddcontentUploadContentPermissions).val(),
                        'sakai:copyright': $('#newaddcontent_upload_content_copyright').val(),
                        'sakai:originaltitle': originalTitle,
                        'sakai:tags': tags,
                        'sakai:fileextension': splitOnDot[splitOnDot.length - 1],
                        'css_class': sakai.config.MimeTypes[sakai.config.Extensions[(originalTitle).slice(originalTitle.lastIndexOf('.') + 1, originalTitle.length).toLowerCase()] || 'other'].cssClass || 'icon-unknown-sprite',
                        'type': 'content',
                        'origin':'user' // 'origin' tells Sakai that this file was selected from the users hard drive
                    };
                    addContentToQueue(contentObj);
                    multifileQueueAddAllowed = true;
                    $thisForm.find(newaddcontentUploadContentTitle + ', ' + newaddcontentUploadContentDescription + ', ' + newaddcontentUploadContentTags).val('');
                    // Increase the number of files that the user browsed for and added to the list
                    numberOfBrowsedFiles++;
                    break;

                ///////////////////
                // Adding a link //
                ///////////////////

                case 'newaddcontent_add_link_form':
                    var linkObj = {
                        'sakai:pooled-content-url': $thisForm.find(newaddcontentAddLinkURL).val(),
                        'sakai:pooled-content-file-name': $thisForm.find(newaddcontentAddLinkTitle).val() || $thisForm.find(newaddcontentAddLinkURL).val(),
                        'sakai:description': $thisForm.find(newaddcontentAddLinkDescription).val(),
                        'sakai:tags': tags,
                        'sakai:permissions': sakai.config.Permissions.Links.defaultaccess,
                        'sakai:copyright': sakai.config.Permissions.Copyright.defaults['links'],
                        'css_class': 'icon-url-sprite',
                        'type':'link'
                    };
                    addContentToQueue(linkObj);
                    $thisForm.reset();
                    break;

                /////////////////////////////
                // Creating a new document //
                /////////////////////////////

                case 'newaddcontent_add_document_form':
                    if ($thisForm.valid()) {
                        var documentObj = {
                            'sakai:pooled-content-file-name': $thisForm.find(newaddcontentAddDocumentTitle).val(),
                            'sakai:permissions': $thisForm.find(newaddcontentAddDocumentPermissions).val(),
                            'sakai:description': $thisForm.find(newaddcontentAddDocumentDescription).val(),
                            'sakai:tags': tags,
                            'sakai:copyright': sakai.config.Permissions.Copyright.defaults['sakaidocs'],
                            'css_class': 'icon-sakaidoc-sprite',
                            'type': 'document'
                        };
                        addContentToQueue(documentObj);
                        $thisForm.reset();
                    }
                    break;

                ///////////////////////////////
                // Re-using existing content //
                ///////////////////////////////

                case 'newaddcontent_existing_content_form':
                    $.each($thisForm.find('.newaddcontent_existingitems_select_checkbox:checked'), function(index, item) {
                        if (!$(item).is(':disabled')) {
                            var viewers = [];
                            if ($(item).data('sakai-pooled-content-viewer')) {
                                viewers = ('' + $(item).data('sakai-pooled-content-viewer')).split(',');
                            }
                            var managers = [];
                            if ($(item).data('sakai-pooled-content-manager')) {
                                managers = ('' + $(item).data('sakai-pooled-content-manager')).split(',');
                            }
                            var contentObj = {
                                'sakai:pooled-content-file-name': $(item).next().text(),
                                'sakai:pooled-content-viewer': viewers,
                                'sakai:pooled-content-manager': managers,
                                '_path': item.id,
                                '_mimeType': $(item).data('mimetype'),
                                'canshare': $(item).attr('data-canshare'),
                                'type': 'existing',
                                'css_class': $(item).next().children(newaddcontentExistingItemsListContainerListItemIcon)[0].id
                            };
                            addContentToQueue(contentObj);
                            $(item).attr('disabled', 'disabled');
                            $(item).parent().addClass(newaddcontentExistingItemsListContainerDisabledListItem);
                        }
                    });
                    break;

            }
            sakai.api.Util.AutoSuggest.reset( $autoSuggestElt );
            sakai.api.Util.AutoSuggest.setupTagAndCategoryAutosuggest( $autoSuggestElt, null, $autoSuggestListCatElt );
        };

        ////////////////////
        // D&D'ing a file //
        ////////////////////

       /**
        * This function is invoken when a file is dropped from the desktop into
        * the collection panel. The file is added to the list of items to upload.
        * @param {Object} file    File that has been dropped in from the desktop
        */
       var fileDropped = function(file) {
            var extension = file.name.split('.');
            extension = extension[extension.length - 1];
            var contentObj = {
                'sakai:originaltitle': file.name,
                'sakai:fileextension': extension,
                'sakai:pooled-content-file-name': file.name,
                'sakai:description': '',
                'sakai:tags': '',
                'sakai:permissions': sakai.config.Permissions.Content.defaultaccess,
                'sakai:copyright': sakai.config.Permissions.Copyright.defaults['content'],
                'css_class': sakai.api.Content.getMimeTypeData(file.type).cssClass,
                'type': 'dropped',
                'fileReader': file
            };
            // SAKIII-4264 - we need to disable the renderQueue function in here
            // so we don't get an unresponsive script error in Firefox
            addContentToQueue(contentObj, true);
        };

        ////////////////////////////////////////////////
        // Edit details and Add permissions pop-overs //
        ////////////////////////////////////////////////

        /**
         * Show the pop up to enable the user to edit the permissions of a file in queue (permissions and copyright)
         */
        var changePermissions = function() {
            $newaddcontentSelecteditemsEditDataContainer.hide();
            var index = $(this).parents('li')[0].id.split('_')[2];
            $newaddcontentSelectedItemsEditPermissionsContainer.html(sakai.api.Util.TemplateRenderer(newaddcontentSelectedItemsEditPermissionsTemplates,{item: itemsToUpload[index], i:index, copyright:sakai.config.Permissions.Copyright, sakai:sakai}));
            $newaddcontentSelectedItemsEditPermissionsContainer.show();
            $newaddcontentSelectedItemsEditPermissionsContainer.css('left', $(this).parents('li').position().left + 'px');
            $newaddcontentSelectedItemsEditPermissionsContainer.css('top', $(this).parents('li').position().top + 40 + 'px');
        };

        /**
         * Show the pop up to enable the user to edit the data of a file in queue (description, tags and title)
         */
        var editData = function() {
            $newaddcontentSelectedItemsEditPermissionsContainer.hide();
            var index = $(this).parents('li')[0].id.split('_')[2];
            $newaddcontentSelecteditemsEditDataContainer.html(sakai.api.Util.TemplateRenderer(newaddcontentSelectedItemsEditDataTemplate,{item: itemsToUpload[index], i:index}));
            $newaddcontentSelecteditemsEditDataContainer.show();
            $newaddcontentSelecteditemsEditDataContainer.css('left', $(this).parents('li').position().left + 'px');
            $newaddcontentSelecteditemsEditDataContainer.css('top', $(this).parents('li').position().top + 40 + 'px');

            var editValidateOpts = {
                onclick: true,
                onkeyup: function(element) {
                    $(element).valid();
                },
                onfocusout: true,
                success: function() {
                    $(newaddcontentContainerNewItemSaveChanges).removeAttr('disabled');
                },
                error: function() {
                    $(newaddcontentContainerNewItemSaveChanges).attr('disabled','disabled');
                }
            };

            sakai.api.Util.Forms.validate($(newaddcontentSelectedItemsEditDataForm), editValidateOpts, true);
            $editAutoSuggestElt = $( '#newaddcontent_selecteditems_edit_data_tags:visible', $newaddcontentSelecteditemsEditDataContainer );
            $editAutoSuggestListCatElt = $( '.list_categories', $newaddcontentSelecteditemsEditDataContainer );
            sakai.api.Util.AutoSuggest.setupTagAndCategoryAutosuggest( $editAutoSuggestElt, null, $editAutoSuggestListCatElt, itemsToUpload[index]['sakai:tags'] );
        };

        /**
         * Close the edit popup
         */
        var closeEditData = function() {
            $(this).parent().parent().hide();
        };

        /**
         * Save the changes made to a file in the queue
         */
        var saveEdit = function() {
            var index = $( newaddcontentSelectedItemsEditIndex ).attr( 'id' );
            if ( $newaddcontentSelecteditemsEditDataContainer.is( ':visible' ) ) {
                itemsToUpload[index]['sakai:pooled-content-file-name'] = $(newaddcontentSelecteditemsEditDataContainer + ' ' + newaddcontentSelectedItemsEditDataTitle).val();
                itemsToUpload[index]['sakai:description'] = $(newaddcontentSelecteditemsEditDataContainer + ' ' + newaddcontentSelectedItemsEditDataDescription).val();
                itemsToUpload[index]['sakai:tags'] = sakai.api.Util.AutoSuggest.getTagsAndCategories( $editAutoSuggestElt, true );
            } else {
                itemsToUpload[index]['sakai:permissions'] = $(newaddcontentSelectedItemsEditPermissionsContainer + ' ' + newaddcontentSelectedItemsEditPermissionsPermissions).val();
                itemsToUpload[index]['sakai:copyright'] = $(newaddcontentSelectedItemsEditPermissionsContainer + ' ' + newaddcontentSelectedItemsEditPermissionsCopyright).val();
            }
            $(this).parent().parent().hide();
            renderQueue();
        };

        var uncheckCheckboxes = function() {
            // We need to remove all the other checkboxes first in order to avoid a lag
            $(newaddcontentExistingItemsListContainerCheckboxes).removeAttr('checked');
            // Uncheck the check all checkbox
            $(newaddcontentExistingCheckAll).removeAttr('checked');
        };


        ///////////////////////
        // UPLOADING ACTIONS //
        ///////////////////////

        /**
         * Check if all items have been uploaded
         */
        var checkUploadCompleted = function(files) {
            itemsUploaded++;
            if(itemsToUpload.length === itemsUploaded) {
                sakai.data.me.user.properties.contentCount += itemsUploaded;
                var tmpItemsAdded = $.extend(true, [], existingAdded);
                var itemsAdded = [];
                $.merge(tmpItemsAdded, lastUpload);
                // SAKIII-5583 Filter out items that cannot be shared (and were not shared)
                $.each(tmpItemsAdded, function(index, item) {
                    if (sakai.api.Content.canCurrentUserShareContent(item)) {
                        itemsAdded.push(item);
                    }
                });
                $(window).trigger('done.newaddcontent.sakai', [itemsAdded, libraryToUploadTo]);
                // If adding to a group library or collection, these will also still be added to my library
                if (libraryToUploadTo !== sakai.data.me.user.userid) {
                    brandNewContent[sakai.data.me.user.userid] = brandNewContent[sakai.data.me.user.userid] || [];
                    _.uniq($.merge(brandNewContent[sakai.data.me.user.userid], lastUpload));
                }
                brandNewContent[libraryToUploadTo] = brandNewContent[libraryToUploadTo] || [];
                _.uniq($.merge(brandNewContent[libraryToUploadTo], lastUpload));
                _.uniq($.merge(allNewContent, lastUpload));
                lastUpload = [];
                sakai.api.Util.Modal.close($newaddcontentContainer);
                sakai.api.Util.progressIndicator.hideProgressIndicator();
                var librarytitle = $(newaddcontentSaveTo + ' option:selected').text();
                if (sakai.api.Content.Collections.isCollection(libraryToUploadTo)) {
                    sakai.api.Util.notification.show(sakai.api.i18n.getValueForKey('COLLECTION'), sakai.api.Util.TemplateRenderer('newaddcontent_notification_collection_finished_template', {
                        collectionid: libraryToUploadTo.substring(2),
                        collectiontitle: librarytitle
                    }));
                } else {
                    sakai.api.Util.notification.show(sakai.api.i18n.getValueForKey('LIBRARY'), sakai.api.Util.TemplateRenderer('newaddcontent_notification_finished_template', {
                        sakai: sakai,
                        me: sakai.data.me,
                        libraryid: libraryToUploadTo,
                        librarytitle: librarytitle
                    }));
                }
            }
        };

        /////////////////////////
        // Uploading new files //
        /////////////////////////
        
        /**
         * Execute the multifile upload
         */
        var uploadContent = function() {
            $newaddcontentUploadContentForm.attr('action', uploadPath);
            $newaddcontentUploadContentForm.ajaxForm({
                dataType: 'json',
                data: {'_charset_': 'utf8'},
                success: function(data) {
                    var extractedData = [];
                    for (var i in data) {
                        if (data.hasOwnProperty(i)) {
                            for (var itemToUpload = 0; itemToUpload < itemsToUpload.length; itemToUpload++) {
                                if (itemsToUpload[itemToUpload]['sakai:originaltitle'] === i) {
                                    itemsToUpload[itemToUpload] = $.extend({}, data[i].item, itemsToUpload[itemToUpload]);
                                    if (data[i].type === 'imscp') {
                                        setIMSCPContent(itemsToUpload[itemToUpload], data[i].item);
                                    } else {
                                        setDataOnContent(itemsToUpload[itemToUpload]);
                                    }
                                }
                            }
                        }
                    }
                },
                error: function() {
                    checkUploadCompleted();
                }
            });
            $newaddcontentUploadContentForm.submit();
        };

        /////////////////////
        // IMS-CP Packages //
        /////////////////////

        /**
         * Run through the content of the IMS-CP package returned by the server
         * and store the page contents in proper Sakai Doc structure
         * @param {Object} documentObj    Content object that represents the original zip file upload
         * @param {Object} fileUploadObj  Content object that was returned when uploading the zip file
         */
        var setIMSCPContent = function(documentObj, fileUploadObj) {
            // Use the filename and description provided by the package
            documentObj['sakai:pooled-content-file-name'] = fileUploadObj['sakai:pooled-content-file-name'];
            documentObj['sakai:description'] = fileUploadObj['sakai:description'];
            // Set page content for all pages in the package
            var resources = $.parseJSON(documentObj.resources);
            var content = {};
            var resourceIds = {};
            for (var i = 0; i < resources.length; i++) {
                resourceIds[i] = resources[i]._id;
                var widgetId = sakai.api.Util.generateWidgetId();
                content[resourceIds[i]] = {
                    'rows': [{
                        'id': sakai.api.Util.generateWidgetId(),
                        'columns': [{
                            'width': 1,
                            'elements': [{
                                'id': widgetId,
                                'type': 'htmlblock'
                            }]
                        }]
                    }]
                };
                content[resourceIds[i]][widgetId] = {
                    'htmlblock': {
                        'content': resources[i].page
                    }
                };
            }
            finishSakaiDoc(documentObj, content);
        };

        /////////////////////////////////////////////
        // Uploading files that have been D&D'd in //
        /////////////////////////////////////////////

        /**
         * Upload a file that has been dropped in from the desktop into the
         * collection panel
         * @param {Object} documentObj    Content object that contains the file data and metadata
         */
        var uploadDropped = function(documentObj) {
            var xhReq = new XMLHttpRequest();
            xhReq.open('POST', '/system/pool/createfile', false);
            var formData = new FormData();
            formData.append('enctype', 'multipart/form-data');
            formData.append('filename', documentObj.title);
            formData.append('file', documentObj.fileReader);
            formData.append('_charset_', 'utf-8');
            xhReq.send(formData);
            if (xhReq.status == 201) {
                var data = $.parseJSON(xhReq.responseText);
                documentObj = $.extend({}, data[documentObj['sakai:originaltitle']].item, documentObj);
                if (data[documentObj['sakai:originaltitle']].type === 'imscp') {
                    setIMSCPContent(documentObj, data[documentObj['sakai:originaltitle']].item);
                } else {
                    setDataOnContent(documentObj);
                }
            } else {
                checkUploadCompleted();
            }
            return false;
        };

        //////////////////////////////
        // Creating a new Sakai Doc //
        //////////////////////////////

        /**
         * Creates a sakaidocument
         * @param {Object} documentObj Object containing data needed to create a sakai document
         */
        var createDocument = function(documentObj) {
            var refID = sakai.api.Util.generateWidgetId();
            var title = documentObj['sakai:pooled-content-file-name'];
            var doc = {
                'structure0': $.toJSON({
                    'page1': {
                        '_ref': refID,
                        '_order': 0,
                        '_title': title,
                        'main': {
                            '_ref': refID,
                            '_order': 0,
                            '_title': title
                        }
                    }
                }),
                'mimeType': 'x-sakai/document',
                'sakai:schemaversion': sakai.config.schemaVersion
            };

            $.ajax({
                url: uploadPath,
                data: doc,
                type: 'POST',
                dataType: 'json',
                success: function(data) {
                    documentObj = $.extend({}, data['_contentItem'].item, documentObj);
                    var content = {};
                    content[refID] = sakai.config.defaultSakaiDocContent;
                    finishSakaiDoc(documentObj, content);
                },
                error: function(err) {
                    checkUploadCompleted();
                }
            });
        };

        /**
         * Add the page content for each of the pages in the Sakai Doc
         * @param {Object} documentObj    Content object of the ZIP file that contained the package
         * @param {Object} content        Initial page content for the IMS-CP package
         */
        var finishSakaiDoc = function(documentObj, content) {
            sakai.api.Server.saveJSON('/p/' + documentObj._path, content, function() {
                var batchRequests = [];
                for (var i in content) {
                    if (content.hasOwnProperty(i)) {
                        batchRequests.push({
                            url: '/p/' + documentObj['_path'] + '/' + i + '.save.json',
                            parameters: {
                                'sling:resourceType': 'sakai/pagecontent',
                                'sakai:pagecontent': $.toJSON(content[i]),
                                '_charset_': 'utf-8'
                            },
                            method: 'POST'
                        });
                    }
                }
                sakai.api.Server.batch(batchRequests, function(success, response) {
                     setDataOnContent(documentObj);
                });
            });
        };

        ///////////////////
        // Adding a link //
        ///////////////////

        /**
         * Upload a link
         * @param {Object} linkObj object containing all information necessary to upload a link
         */
        var uploadLink = function(linkObj) {
            var preview = sakai.api.Content.getPreviewUrl(linkObj['sakai:pooled-content-url']);
            var link = {
                'sakai:pooled-content-url': linkObj['sakai:pooled-content-url'],
                'mimeType': 'x-sakai/link',
                'sakai:preview-url': preview.url,
                'sakai:preview-type': preview.type,
                'sakai:preview-avatar': preview.avatar
            };

            $.ajax({
                url: uploadPath,
                data: link,
                type: 'POST',
                dataType: 'JSON',
                success: function(data) {
                    linkObj = $.extend({}, data['_contentItem'].item, linkObj);
                    setDataOnContent(linkObj);
                },
                error: function() {
                    checkUploadCompleted();
                }
            });
        };

        //////////////////////////////
        // General metadata setting //
        //////////////////////////////

        /**
         * Set extra data (title, description,...) on a piece of uploaded content
         * @param {Object} data Contains ID's returned from the server to construct the POST URL and title with
         */
        var setDataOnContent = function(contentObj) {
            var batchRequests = [];
            batchRequests.push({
                'url': '/p/' + contentObj['_path'],
                'method': 'POST',
                'parameters': {
                    'sakai:pooled-content-file-name': contentObj['sakai:pooled-content-file-name'],
                    'sakai:description': contentObj['sakai:description'],
                    'sakai:permissions': contentObj['sakai:permissions'],
                    'sakai:copyright': contentObj['sakai:copyright'],
                    'sakai:allowcomments': 'true',
                    'sakai:showcomments': 'true',
                    'sakai:fileextension': contentObj['sakai:fileextension']
                }
            });

            // Add this content to the selected library
            if(libraryToUploadTo !== sakai.data.me.user.userid) {
                batchRequests.push({
                    url: '/p/' + contentObj['_path'] + '.members.json',
                    parameters: {
                        ':viewer': libraryToUploadTo
                    },
                    method: 'POST'
                });
                // Add the selected library as a viewer to the cached results
                contentObj['sakai:pooled-content-viewer'] = contentObj['sakai:pooled-content-viewer'] || [];
                contentObj['sakai:pooled-content-viewer'].push(libraryToUploadTo);
                // If we are in the context of the group, make the group managers a manager of the
                // content as well
                if (sakai_global.group && sakai_global.group.groupData && sakai_global.group.groupData['sakai:group-id'] === libraryToUploadTo) {
                    // We only do this if the system is configured to support this
                    if (sakai.config.Permissions.Groups.addcontentmanagers) {
                        var roles = sakai.api.Groups.getRoles(sakai_global.group.groupData);
                        for (var role in roles) {
                            if (roles.hasOwnProperty(role) && roles[role].isManagerRole) {
                                batchRequests.push({
                                    url: '/p/' + contentObj['_path'] + '.members.json',
                                    parameters: {
                                        ':manager': libraryToUploadTo + '-' + roles[role].id
                                    },
                                    method: 'POST'
                                });
                            }
                        }
                    }
                }
            }

            // Set initial version
            if (contentObj['_mimeType'] !== 'x-sakai/document') {
                batchRequests.push({
                    'url': '/p/' + contentObj['_path'] + '.save.json',
                    'method': 'POST'
                });
            }

            sakai.api.Server.batch(batchRequests, function(success, response) {
                // Tag the content
                sakai.api.Util.tagEntity('/p/' + (contentObj['_path']), contentObj['sakai:tags'], false, function() {
                    // Set the correct file permissions
                    sakai.api.Content.setFilePermissions([{'hashpath': contentObj['_path'], 'permissions': contentObj['sakai:permissions']}], function() {
                        lastUpload.push(contentObj);
                        checkUploadCompleted(true);
                    });
                });
            });
                            
        };

        /**
         * Add an already existing item to your own library
         * @param {Object} item Item to be added to your own library
         */
        var addToLibrary = function(existingItem) {
            $.ajax({
                'url': '/p/' + existingItem['_path'] + '.json',
                'cache': false,
                'success': function(item) {
                    if (sakai.api.Content.Collections.isCollection(item)) {
                        sakai.api.Content.Collections.shareCollection(item['_path'], libraryToUploadTo, false, function() {
                            item['sakai:pooled-content-viewer'] = item['sakai:pooled-content-viewer'] || [];
                            item['sakai:pooled-content-viewer'].push(libraryToUploadTo);
                            lastUpload.push(item);
                            checkUploadCompleted();
                        });
                    } else {
                        // Don't make the authorizable a viewer if it's already part of the library
                        if (!sakai.api.Content.isContentInLibrary(item, libraryToUploadTo) &&
                            (sakai.api.Content.canCurrentUserShareContent(item) ||
                            libraryToUploadTo === sakai.data.me.user.userid)) {
                            sakai.api.Content.addToLibrary(item['_path'], libraryToUploadTo, false, function() {
                                item['sakai:pooled-content-viewer'] = item['sakai:pooled-content-viewer'] || [];
                                item['sakai:pooled-content-viewer'].push(libraryToUploadTo);
                                lastUpload.push(item);
                                checkUploadCompleted();
                            });
                        } else {
                            existingAdded.push(item);
                            checkUploadCompleted();
                        }
                    }
                }
            });
        };

        /////////////////////////////////////////////
        // Add all collected content to the system //
        /////////////////////////////////////////////

        /**
         * Execute the upload of the files in the queue by calling the functions needed for the specific type of content
         */
        var doUpload = function() {
            sakai.api.Util.progressIndicator.showProgressIndicator(sakai.api.i18n.getValueForKey('UPLOADING_YOUR_CONTENT'), sakai.api.i18n.getValueForKey('PROCESSING'));
            libraryToUploadTo = $(newaddcontentSaveTo).val();
            if(numberOfBrowsedFiles < $('.MultiFile-list').children().length) {
                // Remove the previously added file to avoid https://jira.sakaiproject.org/browse/SAKIII-3269
                $('.MultiFile-list').children().last().find('a').click();
            }
            $.each(itemsToUpload, function(index,item) {
                switch(item.type) {
                    case 'link':
                        uploadLink(item);
                        break;
                    case 'content':
                        if (!contentUploaded) {
                            uploadContent();
                            contentUploaded = true;
                        }
                        break;
                    case 'dropped':
                        uploadDropped(item);
                        break;
                    case 'document':
                        createDocument(item);
                        break;
                    case 'existing':
                        addToLibrary(item);
                        break;
                }
            });
        };

        ////////////////////////
        // MULTIFILE SPECIFIC //
        ////////////////////////

        /**
         * If the user selects another file after already selecting a first file
         * and has not added that first file to the list of files to be uploaded
         * the first file should be deleted from the multifile list as the user
         * hasn't indicated it wants that first file to be uploaded. In this case
         * it could be that the wrong file was selected, or the user changed his
         * mind.
         */
        var decideTrashPrev = function() {
            if (multifileQueueAddAllowed) {
                return false;
            } else {
                return true;
            }
        };

        /**
         * Prefill some of the extra data a file can have
         * @param {String} fileName Name of the selected file
         */
        var preFillContentFields = function(fileName) {
            if (fileName.indexOf('\\') !== -1) {
                fileName = fileName.split('\\')[fileName.split('\\').length - 1];
            }
            $(newaddcontentUploadContentFields + ' ' + newaddcontentUploadContentTitle).val(fileName);
            $(newaddcontentUploadContentFields + ' ' + newaddcontentUploadContentOriginalTitle)[0].id = fileName;
            $(newaddcontentUploadContentTitle).select();
        };


        ///////////////
        // RENDERING //
        ///////////////

        /**
         * Check if a field is valid and the button to add to the list should be enabled
         */
        var checkFieldValidToAdd = function() {
            if ($(this).attr('type') == 'text') {
                var val = $.trim($(this).val());
                if (val) {
                    enableAddToQueue();
                } else {
                    disableAddToQueue();
                }
            } else {
                if ($(newaddcontentExistingContentForm + ' input[type=checkbox]:checked:enabled').length) {
                    enableAddToQueue();
                } else {
                    disableAddToQueue();
                }
            }
        };

        /**
         * Show a selected navigation item
         * @param {Object} $selected Selected navigation item
         */
        var showSelectedItem = function($selected) {
            $newaddcontentNewItemContainer.hide();
            $selected.show();
        };

        /**
         * Show the interface to upload new content
         */
        var renderUploadNewContent = function() {
            showSelectedItem($(newaddcontentUploadContentTemplate));
            $('form#newaddcontent_upload_content_form input[type=\'file\']').MultiFile({
                afterFileSelect: function(element, fileName, master_element) {
                    var trashPrev = decideTrashPrev();
                    if (trashPrev) {
                        // Remove the previously added file
                        $('.MultiFile-list').children().last().prev().find('a').click();
                    }
                    multifileQueueAddAllowed = false;
                    preFillContentFields(fileName);
                    enableAddToQueue();
                }
            });
            $('#newaddcontent_upload_content_copyright_container').html(sakai.api.Util.TemplateRenderer('newaddcontent_copyright_template', {
                copyright: sakai.config.Permissions.Copyright,
                copyright_default: sakai.config.Permissions.Copyright.defaults['content'],
                sakai: sakai
            }));
            if ( !autoSuggestElts[ 'new_content' ] ) {
                autoSuggestElts[ 'new_content' ] = $( newaddcontentUploadContentTags );
            }
            $autoSuggestElt = autoSuggestElts[ 'new_content' ];
            $autoSuggestListCatElt = $( '.list_categories', '#newaddcontent_upload_content_fields' );
            sakai.api.Util.AutoSuggest.setupTagAndCategoryAutosuggest( $autoSuggestElt, null, $autoSuggestListCatElt );
            $('#newaddcontent_container_lhchoice').find('a:first').focus();
        };

        /**
         * Show the interface to add a new document
         */
        var renderNewDocument = function() {
            if ($.trim($(newaddcontentAddDocumentTitle).val()) !== '') {
                enableAddToQueue();
            }
            showSelectedItem($(newaddcontentAddDocumentTemplate));

            if ( !autoSuggestElts[ 'new_document' ] ) {
                autoSuggestElts[ 'new_document' ] = $( newaddcontentAddDocumentTags );
            }
            $autoSuggestElt = autoSuggestElts[ 'new_document' ];
            $autoSuggestListCatElt = $( '.list_categories', '#newaddcontent_add_document_form' );
            sakai.api.Util.AutoSuggest.setupTagAndCategoryAutosuggest( $autoSuggestElt, null, $autoSuggestListCatElt );
        };

        var searchPaging = function(pagenum) {
            prepareContentSearch(pagenum);
        };

        var searchAndRenderExistingContent = function($container, q, pagenum) {
            pagenum = pagenum || 1;
            var searchURL = '';
            var sortOrder = $(newaddcontentExistingItemsListContainerActionsSort + ' option:selected').attr('data-sort-order');
            var sortOn = $(newaddcontentExistingItemsListContainerActionsSort + ' option:selected').attr('data-sort-on');
            switch(currentExistingContext) {
                case 'everything':
                    if (q === '*') {
                        searchURL = '/var/search/pool/all-all.infinity.json?items=10&page=' + (pagenum - 1) + '&sortOrder=' + sortOrder + '&sortOn=' + sortOn;
                    } else {
                        searchURL = '/var/search/pool/all.infinity.json?items=10&page=' + (pagenum - 1) + '&sortOrder=' + sortOrder + '&sortOn=' + sortOn + '&q=' + q;
                    }
                    break;
                case 'my_library':
                    searchURL = sakai.config.URL.POOLED_CONTENT_SPECIFIC_USER + '?userid=' + sakai.data.me.user.userid + '&items=10&page=' + (pagenum - 1) + '&sortOrder=' + sortOrder + '&sortOn=' + sortOn + '&q=' + q;
                    break;
            }
            uncheckCheckboxes();
            $.ajax({
                url: searchURL,
                type: 'GET',
                success: function(data) {
                    var existingIDs = [];
                    $.each(itemsToUpload, function(index, item) {
                        if(item.type === 'existing') {
                            existingIDs.push(item['_path']);
                        }
                    });
                    if (data && data.results) {
                        existingItems = data.results;
                    }
                    $container.html(sakai.api.Util.TemplateRenderer(newaddcontentExistingItemsTemplate, {'data': data, 'query':q, 'sakai':sakai, 'queue':existingIDs, 'context':currentExistingContext}));
                    // Disable the add button
                    disableAddToQueue();
                    var numberOfPages = Math.ceil(data.total / 10);
                    $('#newaddcontent_existingitems_paging').pager({
                        pagenumber: pagenum,
                        pagecount: numberOfPages,
                        buttonClickCallback: searchPaging
                    });
                    if (numberOfPages > 1) {
                        $('#newaddcontent_existingitems_paging').show();
                    } else {
                        $('#newaddcontent_existingitems_paging').hide();
                    }
                },
                error: function(err) {

                }
            });
        };

        /**
         * Decide what context to render to add existing content
         * @param {Object} context The context that will help decide what to render
         */
        var renderExistingContent = function(q, pagenum) {
            if (!q) {
                q = '*';
            }
            switch(currentExistingContext) {
                case 'everything':
                    showSelectedItem($(newaddcontentAddExistingTemplate));
                    searchAndRenderExistingContent($(newaddcontentExistingItemsListContainerList), q, pagenum);
                    break;
                case 'my_library':
                    showSelectedItem($(newaddcontentAddExistingTemplate));
                    searchAndRenderExistingContent($(newaddcontentExistingItemsListContainerList), q, pagenum);
                    break;
            }
        };

        /**
         * Show the interface to add a link
         */
        var renderAddLink = function() {
            if ($.trim($(newaddcontentAddLinkURL).val()) !== '') {
                enableAddToQueue();
            }
            showSelectedItem($(newaddcontentAddLinkTemplate));

            if ( !autoSuggestElts[ 'new_link' ] ) {
                autoSuggestElts[ 'new_link' ] = $( newaddcontentAddLinkTags );
            }

            $autoSuggestElt = autoSuggestElts[ 'new_link' ];
            $autoSuggestListCatElt = $( '.list_categories', '#newaddcontent_add_link_form' );
            sakai.api.Util.AutoSuggest.setupTagAndCategoryAutosuggest( $autoSuggestElt, null, $autoSuggestListCatElt );
        };

        ////////////////////
        // CONTENT SEARCH //
        ////////////////////

        /**
         * Check/uncheck all of the displayed results
         */
        var checkUncheckAll = function() {
            if ($(newaddcontentExistingCheckAll).is(':checked')) {
                $('.newaddcontent_existingitems_select_checkbox:enabled', $(newaddcontentExistingItemsListContainerList)).attr('checked', 'checked');
            } else {
                $('.newaddcontent_existingitems_select_checkbox:enabled', $(newaddcontentExistingItemsListContainerList)).removeAttr('checked');
            }
            checkFieldValidToAdd();
        };

        /**
         * Prepare and call the function to render existing content in a list
         */
        var prepareContentSearch = function(pagenum) {
            var query = $.trim($newaddcontentExistingItemsSearch.val());
            renderExistingContent(query, pagenum);
        };

        /**
         * Do a search on existing content
         */
        var searchExistingContent = function(ev) {
            if (ev.keyCode === 13 || ev.currentTarget.id === 'newaddcontent_existing_search_button') {
                prepareContentSearch(1);
            }
        };

        ////////////////
        // NAVIGATION //
        ////////////////

        /**
         * Reset the menu to its original state
         */
        var resetMenu = function() {
            $newaddcontentContainerNewItem.removeClass(newaddcontentContainerNewItemExtraRoundedBorderClass);
            $newaddcontentContainerLHChoiceItem.removeClass(newaddcontentContainerLHChoiceSelectedItem);
            $('#newaddcontent_upload_content').addClass(newaddcontentContainerLHChoiceSelectedItem);

            if (sakai.config.Permissions.Content.defaultaccess) {
                $('#newaddcontent_upload_content_permissions [value=' + sakai.config.Permissions.Content.defaultaccess + ']').attr('selected', 'selected');
            }
            if (sakai.config.Permissions.Documents.defaultaccess) {
                $('#newaddcontent_add_document_permissions [value=' + sakai.config.Permissions.Documents.defaultaccess + ']').attr('selected', 'selected');
            }
        };

        /**
         * Decide what to render when the menu is navigated
         * Add/remove some CSS classes to show/hide rounded borders etc.
         */
        var navigateMenu = function() {
            disableAddToQueue();
            $newaddcontentContainerNewItemRaquoRight.removeClass(newaddcontentContainerNewItemRaquoRightDocumentsposition);
            $newaddcontentContainerNewItemAddToList.removeClass(newaddcontentContainerNewItemAddToListDocumentsposition);
            $newaddcontentContainerNewItemAddToList.removeClass(newaddcontentContainerNewItemAddToListExistingContentposition);
            $newaddcontentContainerNewItemAddToList.removeClass(newaddcontentContainerNewItemAddToListUploadNewContent);
            $newaddcontentContainerNewItemAddToList.removeClass(newaddcontentContainerNewItemAddToListAddLink);
            if ($(this).prev().hasClass(newaddcontentContainerLHChoiceItemClass)) {
                $newaddcontentContainerNewItem.addClass(newaddcontentContainerNewItemExtraRoundedBorderClass);
            }
            else {
                $newaddcontentContainerNewItem.removeClass(newaddcontentContainerNewItemExtraRoundedBorderClass);
            }
            $newaddcontentContainerLHChoiceItem.removeClass(newaddcontentContainerLHChoiceSelectedItem);
            $(this).addClass(newaddcontentContainerLHChoiceSelectedItem);

            switch ($(this)[0].id) {
                case 'newaddcontent_upload_content':
                    renderUploadNewContent();
                    $newaddcontentContainerNewItemAddToList.addClass(newaddcontentContainerNewItemAddToListUploadNewContent);
                    break;
                case 'newaddcontent_new_document':
                    renderNewDocument();
                    $newaddcontentContainerNewItemRaquoRight.addClass(newaddcontentContainerNewItemRaquoRightDocumentsposition);
                    $newaddcontentContainerNewItemAddToList.addClass(newaddcontentContainerNewItemAddToListDocumentsposition);
                    break;
                case 'newaddcontent_add_link':
                    renderAddLink();
                    $newaddcontentContainerNewItemAddToList.addClass(newaddcontentContainerNewItemAddToListAddLink);
                    break;
                default: // No ID found on class -> subnav present
                    switch ($(this).children('ul').children(newaddcontentContainerLHChoiceSelectedSubitem)[0].id) {
                        case 'newaddcontent_existing_content_everything':
                            currentExistingContext = 'everything';
                            renderExistingContent($newaddcontentExistingItemsSearch.val());
                            $newaddcontentContainerNewItemAddToList.addClass(newaddcontentContainerNewItemAddToListExistingContentposition);
                            break;
                        case 'newaddcontent_existing_content_my_library':
                            currentExistingContext = 'my_library';
                            renderExistingContent($newaddcontentExistingItemsSearch.val());
                            $newaddcontentContainerNewItemAddToList.addClass(newaddcontentContainerNewItemAddToListExistingContentposition);
                            break;
                    }
                    break;
            }
        };

        /**
         * Executed when a subitem in the navigation has been clicked
         */
        var navigateSubItem = function() {
            $(newaddcontentContainerLHChoiceSelectedSubitem).removeClass(newaddcontentContainerLHChoiceSelectedSubitemClass);
            $(this).addClass(newaddcontentContainerLHChoiceSelectedSubitemClass);
        };

        /////////////
        // BINDING //
        /////////////

        /**
         * Remove binding on all elements
         */
        var removeBinding = function() {
            $newaddcontentContainerLHChoiceItem.unbind('click', navigateMenu);
            $newaddcontentContainerLHChoiceSubItem.unbind('click', navigateSubItem);
            $newaddcontentContainerNewItemAddToList.unbind('click', constructItemToAdd);
            $(newaddcontentContainerStartUploadButton).unbind('click', doUpload);
            $(newaddcontentSelectedItemsEditDataClose).die('click', closeEditData);
            $(newaddcontentContainerNewItemSaveChanges).die('click', saveEdit);
            $(newaddcontentSelectedItemsRemove).die('click', removeItemToAdd);
            $(newaddcontentSelectedItemsActionsPermissions).die('click', changePermissions);
            $(newaddcontentSelectedItemsActionsEdit).die('click', editData);
            $(newaddcontentExistingItemsListContainerActionsSort).die('change');
            $(window).unbind('init.deletecontent.sakai', deleteContent);
        };

        /**
         * Add binding to all elements
         */
        var addBinding = function() {
            $newaddcontentContainerLHChoiceItem.bind('click', navigateMenu);
            $newaddcontentContainerLHChoiceSubItem.bind('click', navigateSubItem);
            $newaddcontentContainerNewItemAddToList.bind('click', constructItemToAdd);
            $(newaddcontentContainerStartUploadButton).bind('click', doUpload);
            $(newaddcontentSelectedItemsEditDataClose).live('click', closeEditData);
            $(newaddcontentContainerNewItemSaveChanges).live('click', saveEdit);
            $(newaddcontentSelectedItemsRemove).live('click', removeItemToAdd);
            $(newaddcontentSelectedItemsActionsPermissions).live('click', changePermissions);
            $(newaddcontentSelectedItemsActionsEdit).live('click', editData);
            $newaddcontentExistingItemsSearch.keydown(searchExistingContent);
            $(newaddcontentAddExistingSearchButton).click(searchExistingContent);
            $(newaddcontentExistingContentForm + ' input').live('click',checkFieldValidToAdd);
            $(newaddcontentExistingCheckAll).live('change', checkUncheckAll);
            $(newaddcontentExistingItemsListContainerActionsSort).live('change', function() {searchPaging(1);});
            $(newaddcontentSaveTo).live('change', greyOutExistingInLibrary);
            sakai.api.Util.hideOnClickOut($newaddcontentSelecteditemsEditDataContainer, newaddcontentSelectedItemsActionsEdit + ', #assignlocation_container');
            sakai.api.Util.hideOnClickOut($newaddcontentSelectedItemsEditPermissionsContainer, newaddcontentSelectedItemsActionsPermissions);

            // Initialize the validate plug-in
            var linkValidateOpts = {
                onclick: true,
                onfocusout: true,
                success: enableAddToQueue,
                error: disableAddToQueue
            };

            sakai.api.Util.Forms.validate($newaddcontentAddLinkForm, linkValidateOpts, true);

            // Need to create one validation opts object per validation
            // I tried $.extend()'ing the previous one, but the callbacks won't fire
            var documentValidateOpts = {
                onclick: true,
                onkeyup: function(element) { $(element).valid(); },
                onfocusout: true,
                success: enableAddToQueue,
                error: disableAddToQueue
            };

            sakai.api.Util.Forms.validate($(newaddcontentAddDocumentForm), documentValidateOpts, true);

            var dropbox = $('#newaddcontent_container_selecteditems');

            $('#newaddcontent_container_selecteditems').fileupload({
                url: uploadPath,
                drop: function (ev, data) {
                    ev.stopPropagation();
                    ev.preventDefault();
                    // We only support browsers that have XMLHttpRequest Level 2
                    if (!window.FormData) {
                        return false;
                    }
                    if ($(ev.target).is($('#newaddcontent_container_selecteditems')) || $(ev.target).parents('#newaddcontent_container_selecteditems').length) {
                        var error = false;
                        $.each(data.files, function (index, file) {
                            if (file.size > 0) {
                                fileDropped(file);
                            } else {
                                error = true;
                            }
                        });
                        if (error) {
                            sakai.api.Util.notification.show(
                                sakai.api.i18n.getValueForKey('DRAG_AND_DROP_ERROR', 'newaddcontent'),
                                sakai.api.i18n.getValueForKey('ONE_OR_MORE_DROPPED_FILES_HAS_AN_ERROR', 'newaddcontent'));
                        }
                        renderQueue();
                    }
                }
            });

            $(window).bind('done.deletecontent.sakai', deleteContent);
        };

        ////////////////////
        // INITIALIZATION //
        ////////////////////

        var setCurrentlySelectedLibrary = function() {
            if (sakai_global.group && sakai_global.group.groupId) {
                currentSelectedLibrary = sakai_global.group.groupId;
            } else if (sakai_global.content_profile && sakai_global.content_profile.content_data && sakai_global.content_profile.content_data.data &&
                sakai.api.Content.Collections.isCollection(sakai_global.content_profile.content_data.data)) {
                currentSelectedLibrary = sakai.api.Content.Collections.getCollectionGroupId(sakai_global.content_profile.content_data.data);
            }
        };

        /**
         * Initialize the modal dialog
         */
        var initializeJQM = function(){
            sakai.api.Util.Modal.setup($newaddcontentContainer, {
                modal: true,
                overlay: 20,
                zIndex: 4001,
                toTop: true,
                onHide: function(hash) {
                    uncheckCheckboxes();
                    hash.o.remove();
                    hash.w.hide();
                }
            });
            sakai.api.Util.Modal.open($newaddcontentContainer);
        };

        /**
         * Call all functions and reset all variables needed to get the widget
         * into the original startup state
         */
        var resetWidget = function() {
            removeBinding();
            resetQueue();
            resetMenu();
            disableAddToQueue();
            disableStartUpload();
            multifileQueueAddAllowed = true;
            contentUploaded = false;
            hideAfterContentUpload = false;
            numberOfBrowsedFiles = 0;
        };

        /**
         * Initialize the widget
         */
        var initialize = function() {
            setCurrentlySelectedLibrary();
            initializeJQM();
            resetWidget();
            addBinding();
            renderUploadNewContent();
        };

        ////////////
        // EVENTS //
        ////////////

        $(window).bind('init.newaddcontent.sakai', function(e, data) {
            initialize();
        });

    };
    
    
    
    sakai_global.newsharecontent = function(tuid, showSettings){

        /////////////////////////////
        // CONFIGURATION VARIABLES //
        /////////////////////////////

        // Containers
        var $newsharecontentContainer = $("#newsharecontent_widget");
        var $newsharecontentCanShareContainer = $('#newsharecontent_canshare_container');
        var $newsharecontentCantShareContainer = $('#newsharecontent_cantshare_container');
        var $newsharecontentMessageContainer = $("#newsharecontent_message_container");

        // Elements
        var $newsharecontentLinkURL = $("#newsharecontent_linkurl");
        var $newsharecontentSharelist = $("#newsharecontent_sharelist");
        var $newsharecontentMessage = $("#newsharecontent_message");
        var $newsharecontentSendButton = $("#sharecontent_send_button");
        var newsharecontentListItem = ".as-selection-item";
        var newsharecontentShareListContainer = "#newsharecontent_sharelist_container";
        var $newsharecontentMessageToggle = $('label.toggletext',$newsharecontentContainer);
        var $newsharecontentMessageArrow = $('#newsharecontent_message_arrow');
        var $newsharecontentHeading = $('#newsharecontent_heading');
        var $newsharecontentAnon = $('.newsharecontent_anon_function');
        var $newsharecontentUser = $('.newsharecontent_user_function');
        var $newsharecontent_form = $("#newsharecontent_form");
        var $newsharecontentTitle = $('#newsharecontent_title');

        // Templates
        var $newsharecontentCantShareTemplate = $('#newsharecontent_cantshare_template');

        // Classes
        var newsharecontentRequiredClass = "newsharecontent_required";

        // Content object
        var contentObj = {};

        
        ///////////////
        // RENDERING //
        ///////////////


        /**
         * Render the list of files that we can't share
         * @param {Object} cantShareFiles A list of all the files that we can't share
         */
        var renderCantShare = function(cantShareFiles) {
            $newsharecontentCantShareContainer.html(
                sakai.api.Util.TemplateRenderer($newsharecontentCantShareTemplate, {
                    'files': cantShareFiles
                })
            );
        };

        /**
         * Get all the files you can share with other people
         * @param {Object} files A list of all the files
         * @return {Object} A list of the files you can share with other people
         */
        var getCanShareFiles = function(files) {
            return _.filter(files, function(file) {
                return sakai.api.Content.canCurrentUserShareContent(file.body);
            });
        };

        var fillShareData = function(hash){
            $newsharecontentLinkURL.val(contentObj.shareUrl);

            var cantShareFiles = _.filter(contentObj.data, function(file) {
                return !sakai.api.Content.canCurrentUserShareContent(file.body);
            });
            var shareFiles = getCanShareFiles(contentObj.data);
            var filenames = sakai.api.Util.TemplateRenderer('newsharecontent_filenames_template', {
                'files': shareFiles
            });
            var shareURLs = sakai.api.Util.TemplateRenderer('newsharecontent_fileURLs_template', {
                'files': shareFiles,
                'sakai': sakai
            });
            var shareData = {
                'filename': filenames,
                'data': shareFiles,
                'path': shareURLs,
                'user': sakai.api.User.getFirstName(sakai.data.me.profile)
            };
            $newsharecontentMessage.html(sakai.api.Util.TemplateRenderer("newsharecontent_share_message_template", shareData));

            renderCantShare(cantShareFiles);

            if (shareFiles.length) {
                $newsharecontentCanShareContainer.show();
                $newsharecontentTitle.show();
            } else {
                $newsharecontentCanShareContainer.hide();
                $newsharecontentTitle.hide();
            }

            if (hash) {
                hash.w.show();
            }
            var tbx = $('#toolbox');
            if (tbx.find("a").length) {
                tbx.find("a").remove();
            }
            var svcs = {facebook: 'Facebook', twitter: 'Twitter', delicious:'Delicious', stumbleupon: 'StumbleUpon', blogger:'Blogger', wordpress:'Wordpress', google:'Google', expanded: 'More'};
            var addThisTitle ="";
            for (var s in svcs) {
                if (s==='twitter'){
                    addThisTitle = sakai.api.i18n.getValueForKey("SHARE_EXT_MSG1",'newsharecontent')+shareData.filename.replace(/"/gi,'')+' '+sakai.api.i18n.getValueForKey("SHARE_EXT_MSG2",'newsharecontent')+' ' +sakai.api.i18n.getValueForKey("TITLE_PLAIN");
                }
                else{
                    addThisTitle =  shareData.filename.replace(/"/gi,'')+' '+sakai.api.i18n.getValueForKey("SHARE_EXT_MSG2",'newsharecontent')+' ' + sakai.api.i18n.getValueForKey("TITLE_PLAIN");
                }
                tbx.append('<a class="addthis_button_'+s+'" addthis:url="'+shareData.path+'" addthis:title="'+addThisTitle+'"></a>');
            }
            addthis.toolbox("#toolbox");
        };

        var resetWidget = function(hash){
            $newsharecontentMessageContainer.hide();
            $newsharecontentMessageArrow.removeClass('arrow_down');
            $newsharecontentMessage.removeClass(newsharecontentRequiredClass);
            $(newsharecontentShareListContainer).removeClass(newsharecontentRequiredClass);
            sakai.api.Util.AutoSuggest.reset($newsharecontentSharelist);
            $(window).trigger("hiding.newsharecontent.sakai");
            hash.w.hide();
        };

        ///////////
        // SHARE //
        ///////////

        var getSelectedList = function() {
            var list = $("#as-values-" + tuid).val();
            // this value is a comma-delimited list
            // split it and get rid of any empty values in the array
            list = list.split(",");
            var removed = 0;
            $(list).each(function(i, val) {

               if (val === "") {
                   list.splice(i - removed, 1);
                   removed += 1;
               }
            });

            // Create list to show in the notification
            var toAddNames = [];
            $("#newsharecontent_container .as-selection-item").each(function(){
                // In IE 7 </A> is returned and in firefox </a>
                toAddNames.push($(this).html().split(/<\/[aA]?>/g)[1]);
            });
            var returnValue = {"list":list, "toAddNames":toAddNames};

            return returnValue;
        };

        var createActivity = function(activityMessage, canShareFiles) {
            var activityData = {
                "sakai:activityMessage": activityMessage
            };
            $.each(canShareFiles, function(i, content){
                sakai.api.Activity.createActivity("/p/" + content.body["_path"], "content", "default", activityData);
            });
            $(window).trigger("load.content_profile.sakai", function(){
                $(window).trigger("render.entity.sakai", ["content", contentObj]);
            });
        };

        var doShare = function(event, userlist, message, contentobj, role) {
            var userList = userlist || getSelectedList();
            var messageText = message || $.trim($newsharecontentMessage.val());
            contentObj = contentobj || contentObj;
            var canShareFiles = getCanShareFiles(contentObj.data);
            $newsharecontentMessage.removeClass(newsharecontentRequiredClass);
            $(newsharecontentShareListContainer).removeClass(newsharecontentRequiredClass);
            if (userList && userList.list && userList.list.length && messageText && canShareFiles) {
                var toAddList = userList.list.slice();
                userList.list = toAddList;
                if (toAddList.length) {
                    sakai.api.Communication.sendMessage(userList.list,
                        sakai.data.me,
                        sakai.api.i18n.getValueForKey('I_WANT_TO_SHARE', 'newsharecontent') + sakai.api.Util.TemplateRenderer('newsharecontent_filenames_template', {
                            'files': canShareFiles
                        }), messageText, 'message', false, false, true, 'shared_content'
                    );
                    $.each(canShareFiles, function(i, content){
                        if (sakai.api.Content.Collections.isCollection(content.body)){
                            sakai.api.Content.Collections.shareCollection(content.body['_path'], toAddList, role, function() {
                                createActivity('ADDED_A_MEMBER', canShareFiles);
                            });
                        } else {
                            sakai.api.Content.addToLibrary(content.body['_path'], toAddList, role, function() {
                                createActivity('ADDED_A_MEMBER', canShareFiles);
                            });
                        }
                    });
                    sakai.api.Util.notification.show(false, $("#newsharecontent_users_added_text").text() + " " + userList.toAddNames.join(", "), "");
                    $newsharecontentContainer.jqmHide();
                }
            } else {
                if (!messageText) {
                    $newsharecontentMessage.addClass(newsharecontentRequiredClass);
                    sakai.api.Util.notification.show(sakai.api.i18n.getValueForKey("NO_MESSAGE_PROVIDED", "newsharecontent"), sakai.api.i18n.getValueForKey("A_MESSAGE_SHOULD_BE_PROVIDED_TO_SHARE", "newsharecontent"));
                }
                if (!userList.list.length) {
                    $(newsharecontentShareListContainer).addClass(newsharecontentRequiredClass);
                    sakai.api.Util.notification.show(sakai.api.i18n.getValueForKey("NO_USERS_SELECTED", "newsharecontent"), sakai.api.i18n.getValueForKey("NO_USERS_TO_SHARE_FILE_WITH", "newsharecontent"));
                }
                if (!contentObj || !canShareFiles) {
                    $(newsharecontentShareListContainer).addClass(newsharecontentRequiredClass);
                    sakai.api.Util.notification.show(sakai.api.i18n.getValueForKey("AN_ERROR_OCCURRED", "newsharecontent"), sakai.api.i18n.getValueForKey("AN_ERROR_OCCURRED_FULL_MESSAGE", "newsharecontent"));
                }
            }
        };

        //////////////
        // BINDINGS //
        //////////////

        var addBinding = function(){
            $newsharecontentContainer.jqm({
                modal: false,
                overlay: 0,
                toTop: true,
                zIndex: 3000,
                onShow: fillShareData,
                onHide: resetWidget
            });

            $('.share_trigger_click').live('click',function(){
                if($newsharecontentContainer.is(":visible")){
                    $newsharecontentContainer.jqmHide();
                }
                sakai.api.Util.Forms.clearValidation($newsharecontent_form);
                var idArr = $(this).attr("data-entityid");
                if(idArr.length > 1 && !$.isArray(idArr)){
                    idArr = idArr.split(",");
                }
                var $this = $(this);
                var adjustHeight = 0;
                if (sakai.config.enableBranding && $('.branding_widget').is(':visible')) {
                    adjustHeight = parseInt($('.branding_widget').height(), 10) * -1;
                }
                $newsharecontentContainer.css({
                    'top':$this.offset().top + $this.height() + adjustHeight,
                    'left':$this.offset().left + $this.width() / 2 - 119
                });
                // Fetch data for content items
                var batchRequests = [];
                $.each(idArr, function(i, id){
                    batchRequests.push({
                        "url": "/p/" + id + ".json",
                        "method": "GET"
                    });
                });
                sakai.api.Server.batch(batchRequests, function(success, data) {
                    if (success && data) {
                        if (data.results) {
                            $.each(data.results, function(i, result){
                                data.results[i].body = $.parseJSON(data.results[i].body);
                            });
                            contentObj = {
                                data: data.results,
                                shareUrl: sakai.api.Content.createContentURL(data.results[0].body)
                            };
                        } else if (data.url) {
                            contentObj = {
                                data: [data],
                                shareUrl:  sakai.api.Content.createContentURL(data)
                            };
                        }
                        if (window["addthis"]) {
                            $newsharecontentContainer.jqmShow();
                        }
                    }
                });
            });

            $.validator.addMethod("requiredsuggest", function(value, element){
                return $.trim($(element).next("input.as-values").val()).replace(/,/g, "") !== "";
            }, sakai.api.i18n.getValueForKey("AUTOSUGGEST_REQUIRED_ERROR", "newsharecontent"));

            var validateOpts = {
                submitHandler: doShare
            };
            sakai.api.Util.Forms.validate($newsharecontent_form, validateOpts, true);
        };

        $newsharecontentMessageToggle.add($newsharecontentMessageArrow).bind('click',function(){
            $newsharecontentMessageArrow.toggleClass('arrow_down');
            $newsharecontentMessageContainer.stop(true, true).slideToggle();
        });

        sakai.api.Util.hideOnClickOut(".newsharecontent_dialog", ".share_trigger_click", function(){
            $newsharecontentContainer.jqmHide();
        });

        $(window).on("finished.sharecontent.sakai", doShare);

        ////////////////////
        // INITIALIZATION //
        ////////////////////

        var init = function(){
            if (!sakai.data.me.user.anon) {
                $newsharecontentAnon.hide();
                $newsharecontentUser.show();
            } else {
                $newsharecontentContainer.addClass('anon');
            }
            addBinding();
            var ajaxcache = $.ajaxSettings.cache;
            $.ajaxSettings.cache = true;
            $.getScript('//s7.addthis.com/js/250/addthis_widget.js?%23pubid=' + sakai.widgets.newsharecontent.defaultConfiguration.newsharecontent.addThisAccountId + '&domready=1');
            $.ajaxSettings.cache = ajaxcache;
            sakai.api.Util.AutoSuggest.setup( $newsharecontentSharelist, {
                asHtmlID: tuid,
                scrollHeight: 120
            });
            $("label#newsharecontent_autosuggest_for").attr("for", tuid);
        };

        init();
    };
    
    
    sakai_global.personinfo = function(tuid, showSettings) {

        var $rootel = $("#" + tuid);
        var $personinfo_widget = $("#personinfo_widget", $rootel);
        var $personinfo_container = $("#personinfo_container", $rootel);
        var $personinfo_template = $("#personinfo_template", $rootel);
        var $personinfo_close = $(".personinfo_close", $rootel);
        var $personinfo_message = $("#personinfo_message", $rootel);
        var $personinfo_invite = $("#personinfo_invite", $rootel);
        var $personinfo_invited = $("#personinfo_invited", $rootel);
        var $personinfo_pending = $("#personinfo_pending", $rootel);
        var dataCache = {};
        var open = false;
        var userId;

        $personinfo_widget.jqm({
            modal: false,
            overlay: 0,
            zIndex: 900,
            toTop: true
        });

        /**
         * hidePersonInfo
         * Hides the widget
         */
        var hidePersonInfo = function() {
            open = false;
            $personinfo_widget.jqmHide();

            // unbind the close event
            $(document).unbind("click.personinfo_close");
        };

        /**
         * showPersonInfo
         * Shows the widget
         */
        var showPersonInfo = function($clickedEl) {
            var personinfoTop = $clickedEl.offset().top + $clickedEl.height();
            var personinfoLeft = $clickedEl.offset().left + $clickedEl.width() / 2 - 125;

            var adjustHeight = 0;
            if (sakai.config.enableBranding && $('.branding_widget').is(':visible')) {
                adjustHeight = parseInt($('.branding_widget').height(), 10) * -1;
            }

            $personinfo_widget.css({
                top: personinfoTop + adjustHeight,
                left: personinfoLeft
            });

            $personinfo_widget.jqmShow();
        };

        /**
         * showConnectionButton
         * Display appropriate connection button according to users connection state
         */
        var showConnectionButton = function() {
            $personinfo_message.hide();
            $personinfo_invite.hide();
            $personinfo_invited.hide();
            $personinfo_pending.hide();
            if (userId !== sakai.data.me.user.userid && !sakai.data.me.user.anon) {
                $personinfo_message.show();
                if (!dataCache[userId].connectionState || dataCache[userId].connectionState === "NONE") {
                    $personinfo_invite.show();
                } else if (dataCache[userId].connectionState === "PENDING") {
                    $personinfo_pending.show();
                } else if (dataCache[userId].connectionState === "INVITED") {
                    $personinfo_invited.show();
                }
            }
        };

        /**
         * togglePersonInfo
         * Displays the widget
         */
        var togglePersonInfo = function($clickedEl) {
            showConnectionButton();

            var json = {
                "user": dataCache[userId],
                "me": sakai.data.me,
                "sakai": sakai
            };

            $($personinfo_container).html(sakai.api.Util.TemplateRenderer("#personinfo_template", json));
            showPersonInfo($clickedEl);
        };

        /**
         * fetchPersonInfo
         * Fetches data about the user
         */
        var fetchPersonInfo = function($clickedEl) {
            if (dataCache[userId]) {
                togglePersonInfo($clickedEl);
            } else {
                // display loading message
                $($personinfo_container).html(sakai.api.Util.TemplateRenderer("#personinfo_loading_template", {"me": sakai.data.me}));
                showPersonInfo($clickedEl);
                sakai.api.User.getUser(userId, function(success, data) {
                    if (success) {
                        dataCache[userId] = data;

                        // check if user is a contact and their connection state
                        sakai.api.User.getConnectionState(userId, function(state) {
                            dataCache[userId].connectionState = state;
                        });

                        // get display pic
                        var displayPicture = sakai.api.Util.constructProfilePicture(dataCache[userId]);
                        if (!displayPicture) {
                            displayPicture = sakai.config.URL.USER_DEFAULT_ICON_URL;
                        }
                        dataCache[userId].displayPicture = displayPicture;
                        dataCache[userId].displayName = sakai.api.User.getDisplayName(dataCache[userId]);

                        // get content items for the user
                        $.ajax({
                            url: sakai.config.URL.POOLED_CONTENT_SPECIFIC_USER,
                            data: {
                                "page": 0,
                                "items": 20,
                                "userid": userId
                            },
                            success: function(data){
                                // Truncate long filenames
                                if (data && data.results) {
                                    for (var item in data.results) {
                                        if (data.results.hasOwnProperty(item)) {
                                            if (data.results[item]["sakai:pooled-content-file-name"]) {
                                                data.results[item]["sakai:pooled-content-file-name"] = sakai.api.Util.applyThreeDots(data.results[item]["sakai:pooled-content-file-name"], 165, {
                                                    max_rows: 1,
                                                    whole_word: false
                                                }, "s3d-bold");
                                            }
                                        }
                                    }
                                }

                                // add user content to their data object
                                dataCache[userId].contentItems = data;

                                // check user still has widget open before rendering results
                                if (open) {
                                    togglePersonInfo($clickedEl);
                                }
                            }
                        });
                    } else {
                        dataCache[userId] = {
                            displayName: sakai.api.i18n.getValueForKey('PRIVATE_USER', 'personinfo'),
                            displayPicture: sakai.config.URL.USER_DEFAULT_ICON_URL,
                            isPrivate: true
                        };
                        if (open) {
                            togglePersonInfo($clickedEl);
                        }
                    }
                });
            }
        };

        // bind personinfo cancel
        $personinfo_close.live("click", function(){
            hidePersonInfo();
        });

        // bind personinfo message button
        $personinfo_message.live("click", function () {
            var sendMessageUserObj = {};
            sendMessageUserObj.uuid = userId;
            sendMessageUserObj.username = sakai.api.User.getDisplayName(dataCache[userId]);
            sendMessageUserObj.type = "user";
            // initialize the sendmessage-widget
            $(window).trigger("initialize.sendmessage.sakai", [sendMessageUserObj, false, false, null, null, null]);
        });

        // bind personinfo request connection button
        $personinfo_invite.live("click", function(){
            $(window).trigger("initialize.addToContacts.sakai", [dataCache[userId]]);
        });

        // bind personinfo request connection button
        $personinfo_invited.live("click", function(){
            sakai.api.User.acceptContactInvite(userId, function(success) {
                if (success) {
                    $personinfo_invited.hide();
                }
            });
        });

        // bind hashchange to close dialog
        $(window).bind("hashchange hashchanged.inbox.sakai", function(){
            hidePersonInfo();
        });

        // bind click trigger
        $(".personinfo_trigger_click").live("click", function(){
            doInit($(this));
        });

        // bind addtocontact contact request
        $(window).bind("sakai.addToContacts.requested", function(ev, userToAdd){
            if (dataCache[userToAdd.userid]){
                dataCache[userToAdd.userid].connectionState = "PENDING";
                $personinfo_invite.hide();
                $personinfo_pending.show();
            }
        });


        /////////////////////////////
        // Initialization function //
        /////////////////////////////

        /**
         * Initialization function that is run when the widget is triggered.
         * Determines which events to bind to and fetches user data if the widget
         * is not already opened.
         */
        var doInit = function ($clickedEl) {
            userId = $clickedEl.data("userid");

            // bind outside click to close widget
            $(document).bind("click.personinfo_close", function (e) {
                var $clicked = $(e.target);
                // Check if one of the parents is the tooltip
                if (!$clicked.parents().is("#personinfo") && $personinfo_widget.is(":visible")) {
                    hidePersonInfo();
                }
            });

            if (!open && userId){
                open = true;
                fetchPersonInfo($clickedEl);
            }
        };
    };
    
    
    sakai_global.savecontent = function(tuid, showSettings) {

        var $rootel = $("#" + tuid);
        var $savecontent_widget = $("#savecontent_widget", $rootel),
            $savecontent_container = $("#savecontent_container", $rootel),
            $savecontent_template = $("#savecontent_template", $rootel),
            $savecontent_close = $(".savecontent_close", $rootel),
            $savecontent_save = $("#savecontent_save", $rootel);
        var newlyShared = {},
            allNewlyShared = [],
            contentObj = {},
            clickedEl = null;

        $savecontent_widget.jqm({
            modal: false,
            overlay: 0,
            zIndex: 1000,
            toTop: true
        });

        sakai_global.savecontent.getNewContent = function(library) {
            if (!library) {
                return allNewlyShared;
            } else if (newlyShared[library]) {
                return newlyShared[library];
            } else {
                return [];
            }
        };

        var deleteContent = function(e, paths) {
            if (paths && paths.length) {
                $.each(paths, function(i, path) {
                    $.each(allNewlyShared, function(j, newlyShared) {
                        if (newlyShared && newlyShared._path === path) {
                            allNewlyShared.splice(j,1);
                        }
                    });
                    $.each(newlyShared, function(lib, items) {
                        $.each(items, function(k, item) {
                            if (item && item._path === path) {
                                items.splice(k,1);
                            }
                        });
                    });
                });
            }
        };
        $(window).bind("done.deletecontent.sakai", deleteContent);

        /**
         * toggleSavecontent
         * Displays the widget
         */
        var toggleSavecontent = function() {

            $savecontent_save.removeAttr("disabled");

            var adjustHeight = 0;
            if (sakai.config.enableBranding && $('.branding_widget').is(':visible')) {
                adjustHeight = parseInt($('.branding_widget').height(), 10) * -1;
            }

            var savecontentTop = clickedEl.offset().top + clickedEl.height() - 3 + adjustHeight;
            var savecontentLeft = clickedEl.offset().left + clickedEl.width() / 2 - 122;

            $savecontent_widget.css({
                top: savecontentTop,
                left: savecontentLeft
            });

            var json = {
                "files": contentObj.data,
                "context": contentObj.context,
                "libraryHasIt": contentObj.libraryHasIt,
                "groups": contentObj.memberOfGroups,
                "sakai": sakai
            };
            $savecontent_container.html(sakai.api.Util.TemplateRenderer("#savecontent_template", json));
            enableDisableAddButton();
            $savecontent_widget.jqmShow();
        };

        var getFileIDs = function(){
            var tempArr = [];
            $.each(contentObj.data, function(i, content){
                tempArr.push(content.body["_path"]);
            });
            return tempArr;
        };

        /**
         * Checks if the content is a part of my library
         */
        var selectedAlreadyMyLibraryMember = function(){
            contentObj.libraryHasIt = true;
            $.each(contentObj.data, function(i, content){
                if(!sakai.api.Content.isContentInLibrary(content.body, sakai.data.me.user.userid) && !sakai.api.Content.Collections.isCollectionInMyLibrary(content.body)){
                    contentObj.libraryHasIt = false;
                }
                content.body.canShare = sakai.api.Content.canCurrentUserShareContent(content.body);
            });
            toggleSavecontent();
        };

        /**
         * Check if collections are in the content data set, and fetch their members
         */
        var checkCollectionMembers = function(callback) {
            var checkCollections = [];
            $.each(contentObj.data, function(i, selectedContent) {
                var contentItem = selectedContent.body;
                if (!(sakai_global.content_profile && sakai_global.content_profile.content_data &&
                    sakai_global.content_profile.content_data.content_path === '/p/' + contentItem._path) &&
                    sakai.api.Content.Collections.isCollection(contentItem)) {
                    var collectionId = sakai.api.Content.Collections.getCollectionGroupId(contentItem);
                    if (checkCollections.indexOf(collectionId) < 0) {
                        checkCollections.push(sakai.api.Content.Collections.getCollectionGroupId(contentItem));
                    }
                }
            });
            if (checkCollections.length > 0) {
                sakai.api.Groups.getMembers(checkCollections, function(success, data) {
                    $.each(contentObj.data, function(i, contentItem) {
                        if (sakai.api.Content.Collections.isCollection(contentItem.body)) {
                            var collectionId = sakai.api.Content.Collections.getCollectionGroupId(contentItem.body);
                            if (data[collectionId]) {
                                contentItem.body.members = {
                                    'managers': data[collectionId].managers.results,
                                    'viewers': data[collectionId].members.results
                                };
                            }
                        }
                    });
                    callback();
                }, false, true);
            } else {
                callback();
            }
        };

        /**
         * Determines if the selected content items are a part of any groups
         */
        var selectAlreadyInGroup = function(){
            checkCollectionMembers(function() {
                $.each(contentObj.memberOfGroups.entry, function(j, memberOfGroup) {
                    memberOfGroup.alreadyHasIt = true;
                    $.each(contentObj.data, function(i, selectedContent) {
                        var contentItem = selectedContent.body;
                        if (sakai_global.content_profile && sakai_global.content_profile.content_data &&
                            sakai_global.content_profile.content_data.content_path === '/p/' + contentItem._path) {
                            contentItem = sakai_global.content_profile.content_data;
                        }
                        var isContentInGroup = sakai.api.Content.isContentInLibrary(contentItem, memberOfGroup['sakai:group-id']);
                        if (!isContentInGroup){
                            memberOfGroup.alreadyHasIt = false;
                        }
                    });
                });
                selectedAlreadyMyLibraryMember();
            });
        };

        /**
         * hideSavecontent
         * Hides the widget
         */
        var hideSavecontent = function() {
            $(window).trigger("hiding.savecontent.sakai");
            $savecontent_widget.jqmHide();
        };

        /**
         * saveContent
         * Saves the content to the selected group
         * @param {String} id     ID of the group we want to add as a viewer
         */
        var saveContent = function(id){
            if($("#savecontent_select option:selected", $rootel).data("redirect") !== true){
                $savecontent_save.attr("disabled", "disabled");
                $.each(contentObj.data, function(i, content){
                    if (sakai.api.Content.Collections.isCollection(content.body)){
                        sakai.api.Content.Collections.shareCollection(content.body["_path"], id, false, function(){
                            finishSaveContent(content.body["_path"], id);
                        });
                    } else {
                        sakai.api.Content.addToLibrary(content.body["_path"], id, false, finishSaveContent);
                    }
                });
                $(window).trigger("done.newaddcontent.sakai");
                var notificationBody = false;
                var notificationTitle = false;
                if (sakai.api.Content.Collections.isCollection(id)){
                    notificationBody = decodeURIComponent($("#savecontent_collection_add_library_body").html());
                    notificationBody = notificationBody.replace("${collectionid}", sakai.api.Security.safeOutput(sakai.api.Content.Collections.getCollectionPoolId(id)));
                    notificationBody = notificationBody.replace("${collectiontitle}", sakai.api.Security.safeOutput($("#savecontent_select option:selected", $rootel).text()));
                    notificationTitle = $("#savecontent_collection_add_library_title").html();
                } else if (id === sakai.data.me.user.userid) {
                    notificationBody = decodeURIComponent($('#savecontent_my_add_library_body').html());
                    notificationTitle = $('#savecontent_group_add_library_title').html();
                } else {
                    notificationBody = decodeURIComponent($("#savecontent_group_add_library_body").html());
                    notificationBody = notificationBody.replace("${groupid}", sakai.api.Security.safeOutput(id));
                    notificationBody = notificationBody.replace("${grouplibrary}", sakai.api.Security.safeOutput($("#savecontent_select option:selected", $rootel).text()));
                    notificationTitle = $("#savecontent_group_add_library_title").html();
                }
                sakai.api.Util.notification.show(notificationTitle, notificationBody);
                hideSavecontent();
            } else {
                document.location = "/create#l=" + $("#savecontent_select", $rootel).val() + "&contentToAdd=" + getFileIDs().toString();
            }
        };

        var finishSaveContent = function(contentId, entityId){
            // cache the content locally
            if (sakai_global.content_profile) {
                sakai_global.content_profile.content_data.members.viewers.push({
                    "userid": entityId
                });
            }
            $(window).trigger("sakai.entity.updateOwnCounts", {contentId:contentId,entityID:entityId});
        };

        enableDisableAddButton = function(){
            var dropdownSelection = $("#savecontent_select option:selected", $rootel);
            if (dropdownSelection.attr("disabled") || !dropdownSelection.val()){
                $savecontent_save.attr("disabled", "disabled");
            } else {
                $savecontent_save.removeAttr("disabled");
            }
        };

        // bind savecontent cancel
        $savecontent_close.live("click", function(){
            hideSavecontent();
        });

        // bind savecontent save button
        $savecontent_save.live("click", function(){
            var dropdownSelection = $("#savecontent_select option:selected", $rootel);
            if (dropdownSelection.val() === "new_collection"){
                var contentToAdd = [];
                $.each(contentObj.data, function(index, item){
                    contentToAdd.push(item.body);
                });
                hideSavecontent();
                $(window).trigger("create.collections.sakai", [contentToAdd]);
            } else if (!dropdownSelection.is(":disabled") && dropdownSelection.val()) {
                saveContent(dropdownSelection.val());
            }
        });

        $("#savecontent_select", $rootel).live("change", function(){
            enableDisableAddButton();
        });

        sakai.api.Util.hideOnClickOut(".savecontent_dialog", ".savecontent_trigger", hideSavecontent);

        $(".savecontent_trigger").live("click", function(el){
            clickedEl = $(this);
            idArr = clickedEl.attr("data-entityid");
            if(idArr.length > 1 && !$.isArray(idArr)){
                idArr = idArr.split(",");
            }

            contentObj.memberOfGroups = $.extend(true, {}, sakai.api.Groups.getMemberships(sakai.data.me.groups, true));
            contentObj.context = $(el.currentTarget).attr("data-entitycontext") || false;

            var batchRequests = [];
            $.each(idArr, function(i, id){
                batchRequests.push({
                    "url": "/p/" + id + ".2.json",
                    "method": "GET"
                });
            });
            sakai.api.Server.batch(batchRequests, function(success, data) {
                if (success) {
                    $.each(data.results, function(i, content){
                        data.results[i].body = $.parseJSON(data.results[i].body);
                    });
                    contentObj.data = data.results;
                    selectAlreadyInGroup();
                }
            });
        });
    };
    
    
        sakai_global.sendmessage = function(tuid, showSettings) {


            /////////////////////////////
            // CONFIGURATION VARIABLES //
            /////////////////////////////

            var $rootel = $("#"+tuid);

            var toUser = false;  // configurable user to include as a message recipient
            var layover = true;        //    Will this widget be in a popup or inside another element.
            var callbackWhenDone = null;    //    Callback function for when the message gets sent
            var replyMessageID = null;

            // CSS IDs
            var dialogBoxContainer = "#sendmessage_dialog_box";
            var dialogFooterContainer = "#sendmessage_dialog_footer";
            var dialogFooterInner = "dialog_footer_inner";

            var messageDialogContainer = '.message_dialog';
            var messageForm = "#message_form";

            var messageFieldSubject = "#comp-subject";
            var messageFieldBody = "#comp-body";

            var buttonSendMessage = "#send_message";

            var invalidClass = "sendmessage_invalid";
            var errorClass = "sendmessage_error_message";
            var normalClass = "sendmessage_normal_message";
            var dialogBoxClass = "dialogue_box";
            var dialogHeaderClass = ".s3d-dialog-header";
            var dialogContainerClass = "s3d-dialog-container";
            var dialogClass = ".s3d-dialog";

            var notificationSuccess = "#sendmessage_message_sent";
            var notificationError = "#sendmessage_message_error";

            var autoSuggestContainer = "#as-selections-sendmessage_to_autoSuggest";
            var autoSuggestResults = "#as-results-sendmessage_to_autoSuggest";
            var autoSuggestInput = "#sendmessage_to_autoSuggest";
            var autoSuggestValues = "#as-values-sendmessage_to_autoSuggest";
            var sendmessage_to = "#sendmessage_to",
                sendmessage_subject = "#sendmessage_subject",
                sendmessage_body = "#sendmessage_body",
                send_message_cancel = "#send_message_cancel",
                $sendmessage_container = $("#sendmessage_container"),
                $sendmessage_form = $("#sendmessage_form");

            ///////////////////////
            // UTILITY FUNCTIONS //
            ///////////////////////

            /**
             * This method will check if there are any required fields that are not filled in.
             * If a field is not filled in the invalidClass will be added to that field.
             * @return true = no errors, false = error
             */
            var checkFieldsForErrors = function(recipients) {
                var subjectEl = $(messageFieldSubject);
                var bodyEl = $(messageFieldBody);
                var valid = true;
                var subject = subjectEl.val();
                var body = bodyEl.val();

                subjectEl.removeClass(invalidClass);
                bodyEl.removeClass(invalidClass);

                if (!subject) {
                    valid = false;
                    subjectEl.addClass(invalidClass);
                }
                if (!body) {
                    valid = false;
                    bodyEl.addClass(invalidClass);
                }
                // check if there are recipients
                if((recipients.length === 0 && !toUser.length) ||
                    recipients.length === 1 && recipients[0] === "") {
                    // no recipients are selected
                    valid = false;
                    // in the event allowOthers is false, the following will not be seen
                    $(autoSuggestContainer).addClass(invalidClass);
                    $(autoSuggestInput).addClass(invalidClass);
                }

                return valid;
            };

            /**
             * This will reset the whole widget to its default state.
             * It will clear any values or texts that might have been entered.
             */
            var resetView = function() {
                $(dialogHeaderClass, $sendmessage_container).show();
                $sendmessage_container.addClass(dialogContainerClass);
                $(dialogBoxContainer).addClass(dialogBoxClass);
                $(".sendmessage_dialog_footer_inner").addClass(dialogFooterInner);
                $(messageDialogContainer).addClass(dialogClass.replace(/\./,''));
                $(messageDialogContainer).show();
                $(sendmessage_to).show();
                $(sendmessage_subject).show();
                $(sendmessage_body).find("label").show();
                // Clear the input fields
                $(messageFieldSubject + ", " + messageFieldBody).val('');

                // remove autoSuggest if it exists
                sakai.api.Util.AutoSuggest.destroy($("#sendmessage_to_autoSuggest"));
            };

            /**
             * Called when the request to the server has been answered
             * @param {Boolean} succes    If the request failed or succeeded.
             */
            var showMessageSent = function(success) {
                // Depending on success we add the correct class and show the appropriate message.
                if (success) {
                    var successMsg = $(notificationSuccess).text();
                    sakai.api.Util.notification.show("", successMsg, sakai.api.Util.notification.type.INFORMATION);
                }
                else {
                    var errorMsg = $(notificationError).text();
                    sakai.api.Util.notification.show("", errorMsg, sakai.api.Util.notification.type.ERROR);
                }
                if ($(messageDialogContainer).hasClass('s3d-dialog')) {
                    sakai.api.Util.Modal.close(messageDialogContainer);
                }

                // If we have a valid callback function we call that
                // and dont show the message
                // If we dont have a callback we show a default message and fade out the layover.
                if (success && callbackWhenDone !== null) {
                    callbackWhenDone(true);
                }

                // Reset all the instance variables
                toUser = false;
                layover = true;
                callbackWhenDone = null;
                replyMessageID = null;
            };


            ///////////////////////////////////
            // CONTACTS, GROUPS, AUTOSUGGEST //
            ///////////////////////////////////

            /**
             * Initiates the 'To' field autoSuggest plugin with contact and group data
             * @return None
             */
            var initAutoSuggest = function() {
                var preFill = [];
                if (toUser) {
                    if ($.isPlainObject(toUser) && toUser.uuid) {
                        preFill.push({
                            "name": toUser.username,
                            "value": toUser.uuid
                        });
                    } else if (_.isArray(toUser)) {
                        $.each(toUser, function(i,usr) {
                            preFill.push({
                                "name": usr.username,
                                "value": usr.uuid
                            });
                        });
                    }
                }
                sakai.api.Util.AutoSuggest.setup($("#sendmessage_to_autoSuggest"), {
                    "asHtmlID": "sendmessage_to_autoSuggest",
                    startText: sakai.api.i18n.getValueForKey("ENTER_CONTACT_OR_GROUP_NAMES", "sendmessage"),
                    keyDelay: "200",
                    retrieveLimit: 10,
                    preFill: preFill,
                    searchObjProps: "name,value",
                    formatList: function(data, elem) {
                        // formats each line to be presented in autosuggest list
                        // add the correct image, wrap name in a class
                        var imgSrc = "/dev/images/user_avatar_icon_32x32.png";
                        if(data.type === "group") {
                            imgSrc = "/dev/images/group_avatar_icon_32x32.png";
                        }
                        var line_item = elem.html(
                            '<img class="sm_suggestion_img" src="' + imgSrc + '" />' +
                            '<span class="sm_suggestion_name">' + data.name + '</span>');
                        return line_item;
                    }
                });
            };

            ///////////////////////////
            // INITIALISE FUNCTION   //
            ///////////////////////////

            /**
             * Initializes the sendmessage widget, optionally preloading the message
             * with a recipient, subject and body. By default, the widget appears as
             * a modal dialog. This function can be called from other widgets or pages.
             * @param {Object|Array} userObj The user object containing the nescecary information {uuid:  "user1", username: "John Doe", type: "user"}, or a user profile
             * @param {jQuery} $insertInId Insert the HTML into another element instead of showing it as a popup (String ID or jQuery)
             * @param {Object} callback When the message is sent this function will be called. If no callback is provided a standard message will be shown that fades out.
             * @param {String} subject The subject
             * @param {String} body The body
             * @param {Boolean} replyOnly hide the to: and subject: fields
             * @param {String} replyID The ID of the message you're replying to
             */
            var initialize = function(userObj, $insertInId, callback, subject, body, replyOnly, replyID, buttonText) {
                layover = true;
                // Make sure that everything is standard.
                resetView();
                // The user we are sending a message to.
                if (userObj && (($.isPlainObject(userObj) && userObj.username) || _.isArray(userObj))) {
                    toUser = userObj;
                } else {
                    toUser = false;
                }

                // Putting the subject and body which have been send in the textboxes
                if(body) {
                    $(messageFieldBody).val(body);
                }
                if(subject) {
                    $(messageFieldSubject).val(subject);
                }

                if (replyOnly) {
                    $(sendmessage_to).find("label").hide();
                    $(sendmessage_subject).hide();
                    $(sendmessage_body).find("label").hide();
                }
                if (replyID) {
                    replyMessageID = replyID;
                } else {
                    replyMessageID = null;
                }

                if (buttonText) {
                    $("#send_message span").text(buttonText);
                } else {
                    $("#send_message span").text($("#sendmessage_default_button_text").text());
                }

                // Maybe we dont want to display a popup but instead want to add it in another div.
                if ($insertInId) {
                    if (!($insertInId instanceof jQuery)) {
                        $insertInId = $(insertInId);
                    }
                    // Make sure this id exists.
                    if ($insertInId.length > 0) {
                        // The id exists!
                        layover = false;

                        // Remove the dialog stuff.
                        $(dialogHeaderClass, $sendmessage_container).hide();
                        $sendmessage_container.removeClass(dialogContainerClass);
                        $(messageDialogContainer).removeClass(dialogClass.replace(/\./,''));
                        $(dialogBoxContainer).removeClass(dialogBoxClass);
                        // Altough this isnt strictly nescecary it is cleaner.
                        $rootel = $insertInId;
                        $rootel.append($(messageDialogContainer));
                        $sendmessage_form = $("#sendmessage_form", $rootel);
                        bindEvents();
                    }
                } else {
                    $rootel = $("#"+tuid);
                    $sendmessage_form = $("#sendmessage_form", $rootel);
                    bindEvents();
                }

                initAutoSuggest();
                // Store the callback
                if (callback) {
                    callbackWhenDone = callback;
                }

                // show popup
                if (layover) {
                    var dialogOptions = {
                        modal: true,
                        overlay: 20,
                        toTop: true
                    };
                    var openOptions = {
                        bindKeyboardFocusIgnoreElements: 'a.as-close'
                    };
                    sakai.api.Util.Modal.setup(messageDialogContainer, dialogOptions);
                    sakai.api.Util.Modal.open(messageDialogContainer, openOptions);
                }
                sakai.api.Util.Forms.clearValidation($sendmessage_form);
            };



            ////////////////////
            // EVENT HANDLING //
            ////////////////////

            /**
             * Callback function called after a call to send a message has completed
             * @param {Boolean} success Status of the 'sendMessage' AJAX call
             * @param {Object} data Data returned from the 'sendMessage' AJAX call
             * @return None
             */
            var handleSentMessage = function(success, data) {
                if(success) {
                    showMessageSent(success);
                } else {
                    sakai.api.Util.notification.show(
                        sakai.api.i18n.getValueForKey('SEND_MESSAGE', 'sendmessage'),
                        sakai.api.i18n.getValueForKey('YOUR_MESSAGE_FAILED_DELIVERED', 'sendmessage'),
                        sakai.api.Util.notification.type.ERROR);
                }
                $(buttonSendMessage).removeAttr("disabled");
            };

            var sendMessage = function() {
                var recipients = [];
                // fetch list of selected recipients
                var recipientsString = $(autoSuggestValues).val();
                // autoSuggest adds unnecessary commas to the beginning and end
                // of the values string; remove them
                if(recipientsString[0] === ",") {
                    recipientsString = recipientsString.slice(1);
                }
                if(recipientsString[recipientsString.length - 1] === ",") {
                    recipientsString = recipientsString.slice(0, -1);
                }
                recipients = recipientsString.split(",");
                sakai.api.Communication.sendMessage(recipients, sakai.data.me, $(messageFieldSubject).val(), $(messageFieldBody).val(), "message", replyMessageID, handleSentMessage, true, "new_message");
            };

            var bindEvents = function() {
                $.validator.addMethod("requiredsuggest", function(value, element){
                    return value.indexOf(sakai.api.i18n.getValueForKey("ENTER_CONTACT_OR_GROUP_NAMES", "sendmessage")) === -1 && $.trim($(element).next("input.as-values").val()).replace(/,/g, "") !== "";
                }, sakai.api.i18n.getValueForKey("AUTOSUGGEST_REQUIRED_ERROR", "sendmessage"));

                var validateOpts = {
                    submitHandler: sendMessage
                };
                sakai.api.Util.Forms.validate($sendmessage_form, validateOpts, true);

                ////////////////////////
                // jqModal functions  //
                ////////////////////////

                $(send_message_cancel).die("click");
                $(send_message_cancel).live("click", function() {
                    if ($(messageDialogContainer).hasClass('s3d-dialog')) {
                        sakai.api.Util.Modal.close(messageDialogContainer);
                    }
                    if ($.isFunction(callbackWhenDone)) {
                        callbackWhenDone(false);
                    }
                });
                ////////////////////
                // Initialization //
                ////////////////////
                $(window).unbind("initialize.sendmessage.sakai");
                $(window).bind("initialize.sendmessage.sakai", function(e, userObj, insertInId, callback, subject, body, replyOnly, replyID, buttonText) {
                    initialize(userObj, insertInId, callback, subject, body, replyOnly, replyID, buttonText);
                });
            };

            var init = function() {
                bindEvents();
                $(window).trigger("ready.sendmessage.sakai");
            };

            init();
        };
    
    
    
    sakai_global.userpermissions = function(tuid, showSettings){

        var contextData = false;

        ///////////////////////////////////////
        // Retrieving the current permission //
        ///////////////////////////////////////

        var getCurrentPermission = function(){
            var currentPath = contextData.path;
            var page = false;
            if (currentPath.indexOf("/") !== -1) {
                var split = currentPath.split("/");
                page = sakai_global.user.pubdata.structure0[split[0]][split[1]];
            } else {
                page = sakai_global.user.pubdata.structure0[currentPath];
            }
            var permission = page._view;
            $("#userpermissions_area_title").text(sakai.api.i18n.General.process(page._title));
            $("#userpermissions_content_container").html(sakai.api.Util.TemplateRenderer("userpermissions_content_template", {
                "permission": permission
            }));
        };

        /////////////////////////////
        // Storing new permissions //
        /////////////////////////////

        /**
         * Notify the user that the permissions have been changed or an error has occurred
         * @param {Boolean} success Indicates the success or failure of setting the permissions
         */
        var permissionsSet = function(success, data){
            if (success) {
                // Hide the dialog
                sakai.api.Util.Modal.close('#userpermissions_container');
                // Show gritter notification
                sakai.api.Util.notification.show($("#userpermissions_notification_title").text(), $("#userpermissions_notification_body").text());
            }else{
                // Show an error notification
                sakai.api.Util.notification.show($("#userpermissions_notification_title").text(), $("#userpermissions_notification_error_body").text(), sakai.api.Util.notification.type.ERROR);
            }
        };

        /**
         * Apply the selected permissions to the page
         */
        var applyPermissions = function(){
            var currentPath = contextData.path;
            var page = false;
            var split = "";
            if (currentPath.indexOf("/") !== -1) {
                split = currentPath.split("/");
                page = sakai_global.user.pubdata.structure0[split[0]][split[1]];
            } else {
                page = sakai_global.user.pubdata.structure0[currentPath];
            }

            // Collect selected permission
            var permission = $("#userpermissions_area_general_visibility").val();
            page._view = permission;

            sakai.api.Server.saveJSON("/~" + sakai.data.me.user.userid + "/public/pubspace", {
                "structure0": $.toJSON(sakai_global.user.pubdata.structure0)
            });

            if (_.indexOf(["library", "memberships", "contacts"], currentPath) === -1) {
                sakai.api.Content.setACLsOnPath("/~" + sakai.data.me.user.userid + "/public/authprofile/" + split[1], permission.toString(), sakai.data.me.user.userid, permissionsSet);
            } else {
                permissionsSet(true);
            }
        };

        /////////////////////////////////
        // Modal dialog initialization //
        /////////////////////////////////

        var initializeOverlay = function(){
            sakai.api.Util.Modal.open('#userpermissions_container');
        };

        sakai.api.Util.Modal.setup('#userpermissions_container', {
            modal: true,
            overlay: 20,
            toTop: true,
            zIndex: 3000
        });

        /////////////////////
        // Internal events //
        /////////////////////

        $("#userpermissions_apply_permissions").live("click", function(){
            applyPermissions();
        });

        /////////////////////
        // External events //
        /////////////////////

        $(window).bind("permissions.area.trigger", function(ev, _contextData){
            contextData = _contextData
            getCurrentPermission();
            initializeOverlay();
        });

    };
    
    
    
    
    sakai_global.versions = function(tuid, showSettings){


        ///////////////
        // VARIABLES //
        ///////////////

        var $rootel = $("#" + tuid);

        // Vars
        var contentPath = "";
        var currentPageShown = "";
        var versions = [];
        var itemsBeforeScroll = 0;

        // Containers
        var versionsContainer = "#versions_container";

        // Templates
        var versionsTemplate = "versions_template";

        // Elements
        var versionsVersionItem = ".versions_version_item";
        var versionsRestoreVersion = ".versions_restore_version";


        var carouselBinding = function(carousel){
            $("#versions_newer", $rootel).live("click",function(){
                carousel.prev();
            });

            $("#versions_older", $rootel).live("click",function(){
                if (carousel.last !== carousel.size()){
                    carousel.next();
                }
            });

            $("#versions_oldest", $rootel).live("click",function(){
                carousel.scroll(carousel.size() || 0);
            });

            $("#versions_newest", $rootel).live("click",function(){
                carousel.scroll(0);
            });
        };


        ///////////////
        // RENDERING //
        ///////////////

        var renderVersions = function(users) {
            $(versionsContainer, $rootel).html(sakai.api.Util.TemplateRenderer(versionsTemplate, {
                'itemsBeforeScroll': itemsBeforeScroll,
                'users': users,
                "data": versions,
                "sakai": sakai,
                "currentPage": currentPageShown
            }));
            if (versions.length) {
                $('#versions_carousel_container', $rootel).jcarousel({
                    animation: 'slow',
                    easing: 'swing',
                    scroll: 4,
                    start: 0,
                    initCallback: carouselBinding,
                    itemFallbackDimension: 123
                });
            }
        };

        var parseVersions = function(success, data){
            $.each(data.versions, function(index, version){
                version.versionId = index;
                versions.push(version);
            });
            renderVersions(data.users);
        };


        //////////
        // UTIL //
        //////////

        var getVersions = function(){
            sakai.api.Server.loadJSON(currentPageShown.pageSavePath + "/" + currentPageShown.saveRef + ".versions.json", parseVersions);
        };

        var getContext = function(){
            contentPath = $.bbq.getState("content_path");
        };

        var getVersionContent = function(versionId, callback) {
            var version = versions[versionId];
            if (!version.version) {
                var vurl = currentPageShown.pageSavePath + '/' + currentPageShown.saveRef + '.version.,' + version.versionId + ',.json';
                sakai.api.Server.loadJSON(vurl, function(success, data) {
                    if (success) {
                        if (!data.version) {
                            version.version = {
                                'rows': [{
                                    'id': sakai.api.Util.generateWidgetId(),
                                    'columns': [{
                                        'width': 1,
                                        'elements': []
                                    }]
                                }]
                            };
                        } else if (_.isString(data.version)) {
                            version.version = $.parseJSON(data.version);
                        }
                        callback(version);
                    }
                });
            } else {
                callback(version);
            }
        };

        var previewVersion = function(event){
            event.stopPropagation();
            if (!sakai_global.content_profile || sakai_global.content_profile.content_data.data.mimeType == "x-sakai/document") {
                $(".versions_selected", $rootel).removeClass("versions_selected");
                $("#" + currentPageShown.ref).remove();
                $(this).addClass("versions_selected");
                getVersionContent($(this).attr('data-versionId'), showPageVersion);
            } else{
                window.open(currentPageShown.pageSavePath + ".version.," + $(this).attr("data-version") + ",/" + $(this).attr("data-pooleditemname"), "_blank");
            }
        };

        var showPageVersion = function(version) {
            var newPageShown = $.extend(true, {}, currentPageShown);
            newPageShown.content = version.version;
            newPageShown.isVersionHistory = true;
            newPageShown.ref = currentPageShown.ref + '_previewversion';
            $(window).trigger('showpage.contentauthoring.sakai', newPageShown);
        };

        var restoreVersion = function(e) {
            getVersionContent($(this).parent().attr('data-versionId'), saveRestoredVersion);
        };

        var addIgnores = function(version) {
            for (var i in version) {
                if (version.hasOwnProperty(i)) {
                    if (version[i].comments) {
                        delete version[i].comments.message.inbox;
                        version[i].comments.message['inbox@Ignore'] = true;
                    } else if (version[i].discussion) {
                        delete version[i].discussion.message.inbox;
                        version[i].discussion.message['inbox@Ignore'] = true;
                    }
                }
            }
            return version;
        };

        var saveRestoredVersion = function(version) {
            var toStore = $.extend({}, version.version);
            currentPageShown.content = toStore;
            toStore.version = addIgnores(version.version);
            toStore.version = $.toJSON(toStore.version);
            sakai.api.Server.saveJSON(currentPageShown.pageSavePath + "/" + currentPageShown.saveRef, toStore, function(success) {
                $.ajax({
                    url: currentPageShown.pageSavePath + "/" + currentPageShown.saveRef + ".save.json",
                    type: "POST",
                    success: function(){
                        $(window).trigger("update.versions.sakai", currentPageShown);
                    }
                });
            }, false, false, false);
        };


        /////////////
        // BINDING //
        /////////////

        var addBinding = function(){
            if (!sakai_global.content_profile || sakai_global.content_profile.content_data.data.mimeType == "x-sakai/document") {
                $(versionsVersionItem, $rootel).die("click", previewVersion);
                $(versionsVersionItem, $rootel).live("click", previewVersion);
            }

            $(versionsRestoreVersion, $rootel).die("click", restoreVersion);
            $(versionsRestoreVersion, $rootel).live("click", restoreVersion);
        };


        ////////////////////
        // INITIALIZATION //
        ////////////////////

        var doInit = function(){
            versions = [];
            addBinding();
            getContext();
            getVersions();
        };

        $(window).bind("init.versions.sakai", function(ev, cps){
            if ($('.s3d-page-column-left').is(':visible')) {
                // There is a left hand navigation visible, versions widget will be smaller
                $(versionsContainer, $rootel).removeClass("versions_without_left_hand_nav");
                itemsBeforeScroll = 6;
            } else {
                // No left hand navigation visible, versions widget will be wider
                $(versionsContainer, $rootel).addClass("versions_without_left_hand_nav");
                itemsBeforeScroll = 7;
            }
            currentPageShown = cps;
            $('.versions_widget', $rootel).show();
            doInit();
        });
        $(window).bind("close.versions.sakai", function(ev, cps) {
            $('.versions_widget', $rootel).hide();
            $(window).trigger('showpage.contentauthoring.sakai', currentPageShown);
        });

        $(window).bind("update.versions.sakai", function(ev, cps) {
            if ($('.versions_widget', $rootel).is(":visible")) {
                currentPageShown = cps;
                doInit();
            }
        });


    };
    
    
    

});