const sortDirections = {'name': 0, 'rating': 0, 'distance': 0};
var tableData=[];

function resetForm() {
    document.getElementById("aca-form-submit").reset();
    document.getElementById("aca-table-records").innerHTML = "";
    document.getElementById('aca-location').disabled=false;
    document.getElementById("aca-business-details-card").innerHTML = "";
    document.getElementById("aca-distance").value = "10";
    document.getElementById("aca-no-records-message").style.visibility = "hidden";
}

$("#aca-checkbox").click(function () {
    document.getElementById('aca-location').value = "";
    $('#aca-location').attr("disabled", $(this).is(":checked"));
    
 });

$("#aca-form-submit").submit(function(e){
    var form = $(this);
    var actionUrl = form.attr('action');

    var formData = form.serialize()

    if($('input[type="checkbox"]').prop("checked")==true) { 
        $.ajax({
            type: 'GET',
            url: "https://ipinfo.io/?token=f6611e3e57264f",
            success: function(data){
                var geocodes = data.loc.split(",");
                formData = formData.concat("&aca-lat=" + geocodes[0]);
                formData = formData.concat("&aca-long=" + geocodes[1]);
                submitForm(actionUrl, formData);
            }
        });
    } else {
        var location = document.getElementById("aca-location").value;
        $.ajax({
            type: 'GET',
            url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + location + "&key=" + "AIzaSyBY9t-fHVGN_L5pbv0a-gMGVZzfDExT6_w",
            success: function(data){
                if (data && data.results && data.results.length > 0 ) {
                    var lat = data.results[0].geometry.location.lat;
                    var long = data.results[0].geometry.location.lng;
                    formData = formData.concat("&aca-lat=" + lat);
                    formData = formData.concat("&aca-long=" + long);
                    submitForm(actionUrl, formData);
                }
                
            }
        });
    }
    return false;
});

function submitForm (actionUrl, data) {
    document.getElementById("aca-no-records-message").style.visibility = "hidden";
    $.ajax({
        type: 'GET',
        url: actionUrl,
        data: data,
        success: function(data){
            console.log("data is ",data);
            constructBusinessesTable(data)
            tableData=data["businesses"];
            console.log("------");
            console.log("tableData",tableData);
        }
    });
}
var index={
    2:"name",
    3:"rating",
    4:"distance"
}

function sortByColumn(columnIndex){
    console.log(columnIndex);
    console.log("tableData in ",tableData);
    columnName=index[columnIndex]
    console.log(columnName);
    document.getElementById("aca-table");
    console.log(tableData);
    listofBusiness=tableData;
    console.log(listofBusiness[0].name.toLowerCase());
    
    if (sortDirections[columnName] === 0) {
        sortDirections[columnName] = 1
        if(columnName=="name"){
            listofBusiness.sort((a, b) => a[columnName].toLowerCase() > b[columnName].toLowerCase() ? 1 : -1)
        }
        else{
            listofBusiness.sort((a, b) => a[columnName] > b[columnName] ? 1 : -1)
        }
    } else {
        sortDirections[columnName] = 0

        if(columnName=="name"){
            listofBusiness.sort((a, b) => a[columnName].toLowerCase() < b[columnName].toLowerCase() ? 1 : -1)
        }
        else{
            listofBusiness.sort((a, b) => a[columnName] < b[columnName] ? 1 : -1)
        }
    }
    console.log("Sorted List",listofBusiness);
    var sortedTableRecords={"businesses":listofBusiness};
    console.log("sortedData",sortedTableRecords);
    addDataToTable(document.getElementById("aca-table"),sortedTableRecords);
}

function constructBusinessesTable(data) {

    document.getElementById("aca-table-records").innerHTML = '';
    document.getElementById("aca-business-details-card").innerHTML = "";

    if (data != null && data['businesses'] != null && data['businesses'].length > 0) {
        var table = document.createElement('table');
        table.id = "aca-table";
        var thead = document.createElement('thead');
        thead.id="aca-table-header";
        table.appendChild(thead);

        var header = document.createElement('tr'); 

        var th0 = document.createElement('th');
        var th1 = document.createElement('th');
        var th2 = document.createElement('th');
        var th3 = document.createElement('th');
        var th4 = document.createElement('th');

        th2.className = 'sort-columns';
        th3.className = 'sort-columns';
        th4.className = 'sort-columns';
        th2.onclick = () => sortByColumn(2);
        th3.onclick = () => sortByColumn(3)
        th4.onclick = () => sortByColumn(4)
        // th2.onclick = sortByName;
        // th3.onclick = sortByRating;
        // th4.onclick = sortByDistance;

        var noHeader = document.createTextNode("No.");
        var imageHeader = document.createTextNode("Image");
        var nameHeader = document.createTextNode("Business Name");
        var ratingHeader = document.createTextNode("Rating");
        var distanceHeader = document.createTextNode("Distance(miles)");

        th0.appendChild(noHeader);
        th1.appendChild(imageHeader);
        th2.appendChild(nameHeader);
        th3.appendChild(ratingHeader);
        th4.appendChild(distanceHeader);

        header.appendChild(th0);
        header.appendChild(th1);
        header.appendChild(th2);
        header.appendChild(th3);
        header.appendChild(th4);
        thead.append(header);
        table.appendChild(thead);
        addDataToTable(table, data);

        document.getElementById("aca-table-records").appendChild(table);
        document.getElementById("aca-table-records").scrollIntoView();
    } else {
        document.getElementById("aca-no-records-message").style.visibility = "visible";
    }
}

function addDataToTable (table, data) {
    console.log("inside add to table",table,data);
    if (table.getElementsByTagName("tbody").length > 0) {
        table.removeChild(table.getElementsByTagName("tbody")[0]);
    }
    var tbody = document.createElement('tbody');
    tbody.id="aca-table-body"
    data['businesses'].forEach(
        (business, idx) => {
            var tr = document.createElement('tr');   
            var td0 = document.createElement('td');
            var td1 = document.createElement('td');
            var td2 = document.createElement('td');
            var td3 = document.createElement('td');
            var td4 = document.createElement('td');

            td2.className = 'business-names';
            td3.className = 'ratings';
            td4.className = 'distances';
    
            var srNo = document.createTextNode(idx+1);

            var image = document.createElement('img');
            image.width = 120;
            image.height = 120;
            image.src = business['image'];

            var text2 = document.createElement('text');
            text2.innerHTML = business['name'];
            var text3 = document.createTextNode(business['rating']);
            var text4 = document.createTextNode(business['distance']);

            text2.className = 'business-names-text';
            text2.setAttribute("onclick", `getBusinessDetail('${business['id']}')`)
    
            td0.appendChild(srNo);
            td1.appendChild(image);
            td2.appendChild(text2);
            td3.appendChild(text3);
            td4.appendChild(text4);

            tr.appendChild(td0);
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tbody.append(tr)
        }
    )
    table.appendChild(tbody);
}

function getBusinessDetail(id) {
    $.ajax({
        type: 'GET',
        url: "/business-detail/"+id,
        success: function(data){
                console.log(data);
                buildBusinessDetailCard(data)
            }
    });
}

function buildBusinessDetailCard (data) {
    document.getElementById("aca-business-details-card").innerHTML = '';

    var cardContent = document.createElement('div');
    cardContent.id = "aca-business-details-card-content";

    var heading = document.createElement('h2');
    heading.innerHTML = data['name']
    heading.style = "text-align: center";

    cardContent.appendChild(heading)

    cardContent.appendChild(document.createElement('hr'));

    var row1 = document.createElement('div');
    row1.className = 'card-row';
    if (data['status']) {
        var rowCol1 = document.createElement('div');
        rowCol1.appendChild(createHeading('Status'));
        rowCol1.appendChild(createStatusElement(data['status']))
        row1.appendChild(rowCol1);
    }

    if (data['categories'] && data['categories'].length > 0) {
        var rowCol2 = document.createElement('div');
        rowCol2.appendChild(createHeading('Category'));
        rowCol2.appendChild(createTextElement(data['categories'].join(' | ')))        
        row1.appendChild(rowCol2);
    }

    if (data['address']) {
        var rowCol3 = document.createElement('div');
        rowCol3.appendChild(createHeading('Address'));
        //rowCol3.appendChild(createTextElement(data['address']))
        rowCol3.appendChild(createTextElement(data['address']))
        row1.appendChild(rowCol3);
    }

    if (data['phone']) {
        var rowCol4 = document.createElement('div');
        rowCol4.appendChild(createHeading('Phone Number'));
        rowCol4.appendChild(createTextElement(data['phone']))
        row1.appendChild(rowCol4);
    }


    if (data['transactions'] && data['transactions'].length > 0) {
        var rowCol5 = document.createElement('div');
        rowCol5.appendChild(createHeading('Transactions Supported'));
        rowCol5.appendChild(createTextElement(data['transactions'].map(transaction => transaction.charAt(0).toUpperCase() + transaction.slice(1)).join(' | ')));
        row1.appendChild(rowCol5);
    }

    if (data['price']) {
        var rowCol6 = document.createElement('div');
        rowCol6.appendChild(createHeading('Price'));
        rowCol6.appendChild(createTextElement(data['price']));
        row1.appendChild(rowCol6);
    }

    if (data['more_info_link']) {
        var rowCol7 = document.createElement('div');

        rowCol7.appendChild(createHeading('More Info'));
        var link = document.createElement('a');
        link.target="_blank";
        link.href = data['more_info_link'];
        link.innerHTML = 'Yelp';
        rowCol7.appendChild(link);

        row1.appendChild(rowCol7);
    }
    cardContent.appendChild(row1);

    var row5 = document.createElement('div');
    row5.className = 'card-row-photos';

    if (data['photos'] && data['photos'].length > 0) {
        data['photos'].forEach((url, idx) => row5.appendChild(createBusinessPhotosElement(url, 'Photo ' + String((idx + 1)) )));
    }

    cardContent.appendChild(row5);

    document.getElementById("aca-business-details-card").appendChild(cardContent);
    document.getElementById("aca-business-details-card").scrollIntoView();
}

function createHeading(title) {
    var heading = document.createElement('p');
    heading.innerHTML = title;
    heading.className = 'heading-text';
    return heading;
}

function createTextElement(value) {
    var text = document.createTextNode(value);
    return text;
}

function createStatusElement(value) {
    var container = document.createElement('div');
    container.className = value === 'Closed'? 'status-closed': 'status-open';
    var text = document.createTextNode(value);
    container.appendChild(text);
    return container;
}

function createBusinessPhotosElement(url, label) {
    var container = document.createElement('div');

    var photoContainer = document.createElement('div');
    // photoContainer.flex = '90%';

    var image = document.createElement('img');
    image.src = url;
    image.className = 'card-column-photos';
    photoContainer.appendChild(image)
    container.appendChild(photoContainer);

    var label = document.createTextNode(label);
    container.appendChild(label);

    container.className = 'card-column-photos-container';
    return container;
}