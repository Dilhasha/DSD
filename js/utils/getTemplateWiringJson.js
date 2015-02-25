/**
 * name: getTemplateWiringJson.js
 * purpose: get a template wiring json object from the template configuration
 * Created on 2/14/15.
 */

//Function Declarations
function setConditionParametersJsonObj(nodes, conditions, name){

    var conditionParametersObj = {}; //Initialize Object

    //find root node
    var node;

    for(var i in nodes){
        node = nodes[i];
        if(node.order == "root") break;
    }

    //method to create structure of a node
    function createJSONStructure(node){

        var parameterArray = [], orArray = [], andArray = [];

        //search for left sub tree
        for(var i in nodes){
            var newNode = nodes[i], newNodeType;
            //if node has left sub tree
            if(newNode.parent == node.id && newNode.order == "left"){
                newNodeType = newNode.type;
                var obj = createJSONStructure(newNode);
                if(newNodeType == "or") orArray.push(obj);
                else if (newNodeType == "and") andArray.push(obj);
                else if (newNodeType == "condition") parameterArray.push(obj);
            }
        }

        //search for right sub tree
        for(var i in nodes){
            var newNode = nodes[i], newNodeType;
            //if node has right sub tree
            if(newNode.parent == node.id && newNode.order == "right"){
                newNodeType = newNode.type;
                var obj = createJSONStructure(newNode);
                if(newNodeType == "or") orArray.push(obj);
                else if (newNodeType == "and") andArray.push(obj);
                else if (newNodeType == "condition") parameterArray.push(obj);
            }
        }

        if(node.type == "condition"){

            var value;
            //search conditions to get conditions specific details
            for(var i in conditions){
                if(conditions[i].id == node.id){
                    value = "<![CDATA[" + conditions[i].value  + "]]]]>><![CDATA[";
                }
            }

            return {
                "@order" : node.order,
                "#text" :  value
            };
        }
        else if (node.type == "or" || node.type == "and"){
            return {
                "@order" : node.order,
                "AND" : andArray,
                "OR" : orArray,
                "Parameter" : parameterArray
            };
        }
    }

    //create and set the structure of the root node
    if(node.type == "or") {
        conditionParametersObj = {
            "OR" : createJSONStructure(node)
        }
    }
    else if(node.type == "and") {
        conditionParametersObj = {
            "AND" : createJSONStructure(node)
        }
    }
    else if(node.type == "condition") {
        conditionParametersObj = {
            "Parameter" : createJSONStructure(node)
        }
    }

    return conditionParametersObj;

}

function setTemplate(name, type, parameters, conditionParameters){

    var templateJsonObj;

    if(parameters == null || parameters.length==0){
        templateJsonObj = {//Initialize template
            "@type" : type,
            "@name" : name,
            "ConditionParameters" : ""
        };
    }
    else {
        templateJsonObj = {//Initialize template
            "@type": type,
            "@name": name,
            "Parameters": {
                "DirectParameter": ""
            },
            "ConditionParameters": ""
        };

        //set parameters
        var directParametersArray = [], directParameter;

        for(var i in parameters ){
            directParameter = {
                "@name" : parameters[i].name,
                "#text" : parameters[i].value
            };

            directParametersArray.push(directParameter);
        }

        templateJsonObj.Parameters.DirectParameter = directParametersArray;
    }


    //set condition parameters
    var conditionNodes = conditionParameters.nodes;
    var conditions = conditionParameters.conditions;

    templateJsonObj.ConditionParameters = setConditionParametersJsonObj(conditionNodes,conditions,"condition");

    return templateJsonObj;

}

function setTemplateJsonObj(templates){//setted template array

    var templatesArray = [];//Initialize array

    for(var i in templates){
        var name = templates[i].name;
        var type =  templates[i].type;
        var parameters = templates[i].parameters;
        var conditionParameters = templates[i].conditionParameters;

        templatesArray.push(setTemplate(name,type,parameters,conditionParameters));
    }

    return {
        "Template" : templatesArray
    };
}

function setTemplateWiringJsonObj(nodes, templates){

    var templateWiringObj = {};//initialize object

    //find root node
    var node;

    for(var i in nodes){
        node = nodes[i];
        if(node.order == "root") break;
    }

    //method to create structure of a node
    function createJSONStructure(node){

        var templateArray = [], orArray = [], andArray = [];

        //search for left sub tree
        for(var i in nodes){
            var newNode = nodes[i], newNodeType;
            //if node has left sub tree
            if(newNode.parent == node.id && newNode.order == "left"){
                newNodeType = newNode.type;
                var obj = createJSONStructure(newNode);
                if(newNodeType == "or") orArray.push(obj);
                else if (newNodeType == "and") andArray.push(obj);
                else if (newNodeType == "template") templateArray.push(obj);
            }
        }

        //search for right sub tree
        for(var i in nodes){
            var newNode = nodes[i], newNodeType;
            //if node has right sub tree
            if(newNode.parent == node.id && newNode.order == "right"){
                newNodeType = newNode.type;
                var obj = createJSONStructure(newNode);
                if(newNodeType == "or") orArray.push(obj);
                else if (newNodeType == "and") andArray.push(obj);
                else if (newNodeType == "template") templateArray.push(obj);
            }
        }

        if(node.type == "template"){

            var name;
            //search templates to get templates specific details
            for(var i in templates){
                if(templates[i].id == node.id){
                    name = templates[i].name;
                }
            }

            return {
                "@type" : node.order,
                "#text" : name
            };
        }
        else if (node.type == "or" || node.type == "and"){
            return {
                "@type" : node.order,
                "and" : andArray,
                "or" : orArray,
                "template" : templateArray
            };
        }
    }

    //create and set the structure of the root node
    if(node.type == "or") {
        templateWiringObj = {
            "or" : createJSONStructure(node)
        }
    }
    else if(node.type == "and") {
        templateWiringObj = {
            "and" : createJSONStructure(node)
        }
    }
    else if(node.type == "template") {
        templateWiringObj = {
            "template" : createJSONStructure(node)
        }
    }

    return templateWiringObj;
}

function setTemplateConfiguration(templateDetailsJson){

    var templates = templateDetailsJson.templates;
    var templateNodes = templateDetailsJson.nodes;

    var templateConfigObj = {//initialize template config object
        "@name" : templateDetailsJson.name,
        "@from" : templateDetailsJson.from,
        Description : templateDetailsJson.description,
        Templates : "",
        TemplateWiring : ""
    };

    templateConfigObj.Templates = setTemplateJsonObj(templates);

    templateConfigObj.TemplateWiring = setTemplateWiringJsonObj(templateNodes, templates);

    return {
        "TemplateConfig" : templateConfigObj
    };
}