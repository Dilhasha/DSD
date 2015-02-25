/**
 * name: TemplateConfiguration.js
 * purpose: set details for a template
 * Created on 2/14/15.
 */

var setTemplateName=function(existingTemplates,clickedTemplateNodeId,exists){
    var templateName;
    for(var i in existingTemplates){
        if(existingTemplates[i].id == clickedTemplateNodeId){
            templateName = existingTemplates[i].name;
            exists = true;
            break;
        }
    }

    if(!exists){
        var count = 1 + templates.length;
        templateName = 'Template ' + count;
    }
    return templateName;
};

var setExistingTemplateData=function(templates,clickedTemplateNodeId,templateName,parameterObjects){
    //search for the clicked template node id in existing templates array, if already has data
    var existingTemplateData={"templateExists":false,"templateType":'',"isParametersSet":false,"parametersValue":'',"isConditionsSet":false,"conditionsValue":'',"conditionParameters":{}};
    for(var i in templates){
        if(templates[i].id == clickedTemplateNodeId){
            existingTemplateData.templateExists=true;
            templateName = templates[i].name;
            existingTemplateData.templateType = templates[i].type;

            var existingTemplateParameters = templates[i].parameters;
            if(existingTemplateParameters!= null){
                var parametersValue = '';
                for(var j in existingTemplateParameters ){
                    parametersValue = parametersValue + existingTemplateParameters[j].name + '=' + existingTemplateParameters[j].value + '  ';

                    parameterObjects.push({
                        "name" : existingTemplateParameters[j].name,
                        "value" : existingTemplateParameters[j].value
                    });
                }
                existingTemplateData.parametersValue=parametersValue;
                existingTemplateData.isParametersSet=true;
            }
            else{
                existingTemplateData.isParametersSet=true;
            }


            existingTemplateData.conditionsValue = 'Set';
            existingTemplateData.isConditionsSet=true;
            existingTemplateData.conditionParameters=templates[i].conditionParameters;

            break;
        }

    }
    return existingTemplateData;
};

//returns html data to set parameters
var getParameterData=function(parametersData){
    var parametersHtmlData = '<table class="table table-bordered table-condensed"><tbody><label for="exampleInputEmail1">Set Values For Parameters</label>';

    if (parametersData.length==0) {
        parametersHtmlData += '<p>No Parameters To Set</p>';
    } else {
        var parameterType;

        for (var i = 0; i < parametersData.length; ++i) {
            parameterType = parametersData[i].type;
            parametersHtmlData += '<tr><td><strong><span title="' + parametersData[i].description + '">' + parametersData[i].name + '</span></strong></td>';
            if (parameterType == 'double') {
                parametersHtmlData += '<td><input class="form-control" placeholder="Parameter Value" id=' + i.toString() + ' type="number" step="any" placeholder="' + parametersData[i].description + '" required' + '></td></tr>';
            } else if (parameterType == 'time') {
                parametersHtmlData += '<td><input class="form-control" placeholder="Parameter Value" id=' + i.toString() + ' type="number" placeholder="' + parametersData[i].description + '" ' + 'required' + '></td></tr>';
            } else {
                parametersHtmlData += '<td><input class="form-control" placeholder="Parameter Value" id=' + i.toString() + ' placeholder="' + parametersData[i].description + '" required' + '></td></tr>';
            }
        }
    }
    parametersHtmlData += '</tbody></table><button id="saveParameters" type="button" class="btn btn-warning">Save Parameters</button>';
    return parametersHtmlData;
};

var saveDirectParameters=function(parameters,parameterObjects){

    var parameterData = '<span title="Click to Change Parameter Values"><u>';
    var val;
    for (var i = 0; i < parameters.length; ++i) {
        if (i != 0) {
            parameterData += ' , ';
        }
        val = $('#' + i).val();
        parameterData += parameters[i].name + '=' + val + '   ';
        parameterObjects.push({
            "name": parameters[i].name,
            "value": val
        });
    }
    parameterData += '</u</span>';
    return parameterData;

};
