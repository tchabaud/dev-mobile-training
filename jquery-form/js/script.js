(function () {
    'use strict';
    $(document).ready(main);
    var
        key = 'idx',
        contactId = 'data-contactId';

    function main() {
        $('#send').on('click', check);
        $('#show').on('click', displayLocalStorage);
    }

    function check(e) {
        var formId = '#firstForm',
            inputSelector = formId + ' input',
            isValid = true;

        e.preventDefault();
        $(inputSelector).each(function (idx, elt) {
            var lElt = $(elt);
            lElt.removeClass('good').removeClass('error');
            if (lElt.val() !== '') {
                lElt.addClass('good');
            } else {
                isValid = false;
                lElt.addClass('error');
            }
        });

        if (isValid) {
            var person = $(formId).serializeObject();
            var lUserToEdit = localStorage.getItem('userToEdit');
            if (lUserToEdit === null) {
                if (localStorage.getItem(key) !== null) {
                    var lIndex = localStorage.getItem(key);
                    lIndex++;
                    localStorage.setItem(key, lIndex);
                } else {
                    localStorage.setItem(key, 0);
                }
                localStorage.setItem('contact' + localStorage.getItem(key), JSON.stringify($('#firstForm').serializeObject()));
            } else {
                localStorage.setItem(localStorage.getItem('userToEdit'), JSON.stringify(person));
                localStorage.removeItem('userToEdit');
            }
        }
    }

    // Display local storage items into list
    function displayLocalStorage(e) {
        // Reading localStorage
        var nbItems = localStorage.getItem(key),
            frag = document.createDocumentFragment(),
            li, lPersonIdx, person, item, button;

        e.preventDefault();

        for (var i = 0; i <= parseInt(nbItems); i++) {
            li = document.createElement('li');
            lPersonIdx = 'contact' + i;
            person = JSON.parse(localStorage.getItem(lPersonIdx));
            item = document.createTextNode(person.firstName + ' ' + person.lastName);
            button = document.createElement('button');
            $(button).html('Edit');
            $(button).attr(contactId, lPersonIdx);
            $(button).on('click', preloadItem);
            li.appendChild(item);
            frag.appendChild(li).appendChild(button);
        }
        document.getElementById('list').appendChild(frag);
    }

    // Load a clicked item list into form
    function preloadItem(e) {
        e.preventDefault();

        // Fetch localStorage item
        var clickedElt = e.target,
            lId = clickedElt.getAttribute(contactId),
            person = JSON.parse(localStorage.getItem(lId)),
            propsList = listProperties(person);
        $.each(propsList, function (id, val) {
            console.log('id=' + id + ' value=' + val + ' person[' + val + ']=' + person[val]);
            $('#' + val).val(person[val]);
        });
        localStorage.setItem('userToEdit', lId);
    }

    // Deserialize
    function listProperties(obj) {
        var propList = [];
        for (var propName in obj) {
            if (obj.hasOwnProperty(propName)) {
                // if (typeof(obj[propName]) !== 'undefined') {
                propList.push(propName);
            }
        }
        return propList;
    }

    // Serialize
    $.fn.serializeObject = function () {
        var o = {}, a = this.serializeArray();
        $.each(a, function () {
            o[this.name] = this.value || '';
        });
        return o;
    };
}());
