var Benchmark = '4'
var Vintage = '4'
var countyCode;
var stateCode;
var results = [];
t = 1;
u = 0;

function validateAddress(Street, City, State, ZipCode) {
    $.ajax({
        url: "https://geocoding.geo.census.gov/geocoder/geographies/address?format=jsonp",
        dataType: "jsonp",
        async: false,
        data: {
            street: Street,
            city: City,
            state: State,
            zip: ZipCode,
            benchmark: Benchmark,
            vintage: Vintage,
        },
        success: function(response) {
            var countyName;

            console.log(response);
            if (response.result.addressMatches.length == 0) {
                alert("Valid Address Not Entered!");
            }

            if (response.result.addressMatches.length != 0) {
                countyName = response.result.addressMatches[0].geographies.Counties[0].NAME;
                document.getElementById("stateinfo").innerHTML = "Search results for: " + countyName + ", " + State;
                countyCode = response.result.addressMatches[0].geographies.Counties[0].COUNTY;
                stateCode = response.result.addressMatches[0].geographies.Counties[0].STATE;
                var th1 = document.getElementById("yearHeader");
                th1.innerHTML = "YEAR";

                var th2 = document.getElementById("ageHeader");
                th2.innerHTML = "AGE";

                var th3 = document.getElementById("sexHeader");
                th3.innerHTML = "SEX";

                var th4 = document.getElementById("incomeHeader");
                th4.innerHTML = "INCOME";

                var th5 = document.getElementById("NIC_PT");
                th5.innerHTML = "PERCENT INSURED";

                var th6 = document.getElementById("NIC_MOE");
                th6.innerHTML = "PERCENT INSURED: MARGIN OF ERROR";

                var th7 = document.getElementById("NUI_PT");
                th7.innerHTML = "PERCENT UNINSURED";

                var th8 = document.getElementById("NUI_MOE");
                th8.innerHTML = "PERCENT UNINSURED: MARGIN OF ERROR";

                var th9 = document.getElementById("POP");
                th9.innerHTML = "POPULATION";

                var th10 = document.getElementById("POP_MOE");
                th10.innerHTML = "POPULATION: MARGIN OF ERROR";
            }

            getInfo(countyCode, stateCode, 2015, 0, 0, 0);

        },

        error: function() {
            alert("Valid Address Not Entered!");
        }

    })
};

function validateAddressFiltered(Street, City, State, ZipCode) {
    var filteredYears = [];
    var filteredAges = [];
    var filteredIncomes = [];
    var filteredSexes = [];

    var Years = ["2015", "2014", "2013", "2012", "2011", "2010", "2009", "2008", "2007", "2006"];
    var Ages = ["under19", "18to64", "21to64", "40to64", "50to64", "under65"];
    var Incomes = ["allIncomes", "200pov", "250pov", "138pov", "400pov", "138to400"];
    var Sexes = ["allSex", "male", "female"];

    $.ajax({
        url: "https://geocoding.geo.census.gov/geocoder/geographies/address?format=jsonp",
        dataType: "jsonp",
        async: false,
        data: {
            street: Street,
            city: City,
            state: State,
            zip: ZipCode,
            benchmark: Benchmark,
            vintage: Vintage,
        },
        success: function(response) {
            var countyName;
            console.log(response);
            if (response.result.addressMatches.length == 0) {
                alert("Valid Address Not Entered!");

            }

            if (response.result.addressMatches.length != 0) {
                countyCode = response.result.addressMatches[0].geographies.Counties[0].COUNTY;
                document.getElementById("stateinfo").innerHTML = "Search results for: " + countyName + ", " + State;
                stateCode = response.result.addressMatches[0].geographies.Counties[0].STATE;
                countyName = response.result.addressMatches[0].geographies.Counties[0].NAME;

                var th1 = document.getElementById("yearHeader");
                th1.innerHTML = "YEAR";

                var th2 = document.getElementById("ageHeader");
                th2.innerHTML = "AGE";

                var th3 = document.getElementById("sexHeader");
                th3.innerHTML = "SEX";

                var th4 = document.getElementById("incomeHeader");
                th4.innerHTML = "INCOME";

                var th5 = document.getElementById("NIC_PT");
                th5.innerHTML = "PERCENT INSURED";

                var th6 = document.getElementById("NIC_MOE");
                th6.innerHTML = "PERCENT INSURED: MARGIN OF ERROR";

                var th7 = document.getElementById("NUI_PT");
                th7.innerHTML = "PERCENT UNINSURED";

                var th8 = document.getElementById("NUI_MOE");
                th8.innerHTML = "PERCENT UNINSURED: MARGIN OF ERROR";

                var th9 = document.getElementById("POP");
                th9.innerHTML = "POPULATION";

                var th10 = document.getElementById("POP_MOE");
                th10.innerHTML = "POPULATION: MARGIN OF ERROR";
            }



            for (i = 0; i < Years.length; i++) {
                var item = document.getElementById(Years[i]);
                if (item.checked) {
                    filteredYears.push((item).value);
                };
            }

            for (j = 0; j < Ages.length; j++) {
                var item = document.getElementById(Ages[j]);
                if (item.checked) {
                    filteredAges.push((item).value);
                };
            }

            for (p = 0; p < Incomes.length; p++) {
                var item = document.getElementById(Incomes[p]);
                if (item.checked) {
                    filteredIncomes.push((item).value);
                };
            }

            for (q = 0; q < Sexes.length; q++) {
                var item = document.getElementById(Sexes[q]);
                if (item.checked) {
                    filteredSexes.push((item).value);
                };
            }

            // if no filter is selected
            if (filteredYears.length == 0) {
                filteredYears.push(2015);
            }
            if (filteredAges.length == 0) {
                filteredYears.push(0);
            }
            if (filteredSexes.length == 0) {
                filteredSexes.push(0);
            }
            if (filteredIncomes.length == 0) {
                filteredIncomes.push(0);
            }

            for (i = 0; i < filteredYears.length; i++) {
                for (j = 0; j < filteredAges.length; j++) {
                    for (k = 0; k < filteredSexes.length; k++) {
                        for (n = 0; n < filteredIncomes.length; n++) {
                            console.log(t + " " + countyCode + " " + stateCode + " " + filteredYears[i] + " " + filteredAges[j] + " " + filteredSexes[k] + " " + filteredIncomes[n]);
                            getInfo(countyCode, stateCode, filteredYears[i], filteredAges[j], filteredSexes[k], filteredIncomes[n]);
                            t++;
                        }
                    }
                }
            }
        },
        error: function() {
            alert("Valid Address Not Entered!");
        }

    })
};

function getInfo(CountyCode, StateCode, YearCode, AgeCode, SexCode, IncomeCode) {
    var year = YearCode;
    var age = AgeCode;
    var sex = SexCode;
    var income = IncomeCode;
    var countycode = CountyCode;
    var statecode = StateCode;

    $.ajax({
        url: "https://api.census.gov/data/timeseries/healthins/sahie?get=PCTIC_PT,PCTIC_MOE,PCTUI_PT,PCTUI_MOE,NIPR_PT,NIPR_MOE&for=county:" + countycode + "&in=state:" + statecode + "&AGECAT=" + age + "&SEXCAT=" + sex + "&IPRCAT=" + income + "&time=" + year,
        success: function(response) {
            console.log(response);
            neededInfo = [];
            if (response) {
                neededInfo.push(response[1][0]);
                neededInfo.push(response[1][1]);
                neededInfo.push(response[1][2]);
                neededInfo.push(response[1][3]);
                neededInfo.push(response[1][4]);
                neededInfo.push(response[1][5]);
                neededInfo.push(response[1][6]);
                neededInfo.push(response[1][7]);
                neededInfo.push(response[1][8]);
                neededInfo.push(response[1][9]);
            }

            results.push(neededInfo);
            var table = document.getElementById("Table");
            table.style.visibility = "visible";
            document.getElementById("myYear").type = "text";
            document.getElementById("myAge").type = "text";
            document.getElementById("myIncome").type = "text";
            document.getElementById("mySex").type = "text";
            var tbody = document.createElement('tbody');

            var tr = document.createElement("tr");
            var yr = document.createElement("td");
            var ag = document.createElement("td");
            var sx = document.createElement("td");
            var inc = document.createElement("td");
            var NIC = document.createElement("td");
            var NIC_MOE = document.createElement("td");
            var NUI = document.createElement("td");
            var NUI_MOE = document.createElement("td");
            var POP = document.createElement("td");
            var POP_MOE = document.createElement("td");

            NIC.innerHTML = results[u][0];
            NIC_MOE.innerHTML = results[u][1];
            NUI.innerHTML = results[u][2];
            NUI_MOE.innerHTML = results[u][3];
            POP.innerHTML = results[u][4];
            POP_MOE.innerHTML = results[u][5];
            yr.innerHTML = year;

            //age
            if (age == 0) {
                ag.innerHTML = "Under 65";
            } else if (age == 1) {
                ag.innerHTML = "18 to 64 years";
            } else if (age == 2) {
                ag.innerHTML = "40 to 64 years";
            } else if (age == 3) {
                ag.innerHTML = "50 to 64 years";
            } else if (age == 4) {
                ag.innerHTML = "Under 19 years";
            } else if (age == 5) {
                ag.innerHTML = "21 to 64 years";
            }

            //sex
            if (sex == 0) {
                sx.innerHTML = "Both";
            } else if (sex == 1) {
                sx.innerHTML = "M";
            } else if (sex == 2) {
                sx.innerHTML = "F";
            }

            //income
            if (income == 0) {
                inc.innerHTML = "All";
            }
            if (income == 1) {
                inc.innerHTML = "Below 200% of poverty";
            }
            if (income == 2) {
                inc.innerHTML = "Below 250% of poverty";
            }
            if (income == 3) {
                inc.innerHTML = "Below 138% of poverty";
            }
            if (income == 4) {
                inc.innerHTML = "Below 200% of poverty";
            }
            if (income == 5) {
                inc.innerHTML = "138% - 400% of poverty";
            }

            var mylist = [yr, ag, sx, inc, NIC, NIC_MOE, NUI, NUI_MOE, POP, POP_MOE]
            for (x = 0; x < mylist.length; x++) {
                tr.appendChild(mylist[x]);
            }

            tbody.appendChild(tr);
            table.appendChild(tbody);
            u++;

        }
    })
}

function sortYear() {
    var input, filter, table, tr, td, i;
    input = document.getElementById("myYear");
    filter = input.value.toUpperCase();
    table = document.getElementById("Table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function sortAge() {
    var input, filter, table, tr, td, i;
    input = document.getElementById("myAge");
    filter = input.value.toUpperCase();
    table = document.getElementById("Table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function sortIncome() {
    var input, filter, table, tr, td, i;
    input = document.getElementById("myIncome");
    filter = input.value.toUpperCase();
    table = document.getElementById("Table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[3];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

function sortSex() {
    var input, filter, table, tr, td, i;
    input = document.getElementById("mySex");
    filter = input.value.toUpperCase();
    table = document.getElementById("Table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[2];
        if (td) {
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

$(document).ready(function() {
    document.getElementById("filter").onclick = function() {
        validateAddressFiltered(document.getElementById("inputStreet").value,
            document.getElementById("inputCity").value,
            document.getElementById("inputState").value,
            document.getElementById("inputZip").value,
        )

    }
});


$(document).ready(function() {
    document.getElementById("submit").onclick = function() {
        validateAddress(document.getElementById("inputStreet").value,
            document.getElementById("inputCity").value,
            document.getElementById("inputState").value,
            document.getElementById("inputZip").value,
        )
    }
});