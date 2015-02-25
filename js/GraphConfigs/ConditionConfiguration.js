/**
 * name: ConditionConfiguration.js
 * purpose: set details for conditions
 * Created on 2/14/15.
 */
var getConditionParameters=function(templateList,templateType) {
    //getting condition parameters from domain JSON
    var allowedConditionsData=[];
    for (var i = 0; i < templateList.length; ++i) {
        if (templateList[i].name == templateType) {

            allowedConditionsData = templateList[i].ConditionParameters[0].Parameter;
        }
    }
    return allowedConditionsData;
};
var getAllowedConditionsHtmlData=function(conditionParameters) {
    var conditionsHtmlData = '<table class="table table-bordered table-condensed"><caption><b>Allowed Condition Parameters</b></caption><tbody><tr></tr><tr><th>Parameter Name</th><th>Description</th><th>Parameter Type</th></tr>';
    var i;
    for (i = 0; i < conditionParameters.length; ++i) {
        conditionsHtmlData += '<tr><td>' + conditionParameters[i].name + '</td>';
        if (conditionParameters[i].description != undefined) {
            conditionsHtmlData += '<td>' + conditionParameters[i].description + '</td>';
        } else {
            conditionsHtmlData += '<td></td>';
        }
        conditionsHtmlData += '<td>' + conditionParameters[i].type + '</td></tr>';
    }
    conditionsHtmlData += '</tbody></table>';
    return conditionsHtmlData;
};
var setConditionSelection=function(conditionParameters){

    var selectConditionParameterHtmlData='<label for="exampleInputEmail1">Select a parameter</label><select class="form-control" id="parameter" name="selectDomain">';

    for (var i = 0; i < conditionParameters.length; ++i) {
        selectConditionParameterHtmlData += '<option value=' + conditionParameters[i].name + '>' + conditionParameters[i].name + '</option>';
    }
    selectConditionParameterHtmlData += '</select><button type="button" id="parameterButton" class="btn btn-success">Select Parameter</button>';
    return selectConditionParameterHtmlData;
};

var getConditionFields = function(parameterType) {
    var htmlData = '';
    if (parameterType == 'double') {
        htmlData += '<br><select class="form-control" id="operator">';
        htmlData += '<option value=">">></option><option value="<"><</option><option value="==">==</option><option value="!=">!=</option>';
        htmlData += '</select>';
        htmlData += '<input class="form-control" id="value" type="number" step="any" placeholder="Enter Value" required>';
    } else if (parameterType == 'int') {
        htmlData += '<br><select class="form-control" id="operator">';
        htmlData += '<option value=">">></option><option value="<"><</option><option value="==">==</option><option value="!=">!=</option>';
        htmlData += '</select>';
        htmlData += '<input class="form-control" id="value" type="number" placeholder="Enter Value" required>';
    }
    //If type is String
    else {
        htmlData += '<br><select class="form-control" id="operator"><option value="==">==</option><option value="!=">!=</option></select>';
        htmlData += '<input class="form-control" id="value" placeholder="Enter Value" required>';
    }
    return htmlData;
};