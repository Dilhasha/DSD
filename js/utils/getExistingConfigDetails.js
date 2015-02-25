/**
 * name: getExistingConfig.js
 * purpose: get Existing configuration details
 * Created on 2/14/15.
 */



function getExistingConfigDetails(templateWiringJson){
    var templateDetailsJSON= JSON.parse('{"description":"","name":"","from":"","nodes":[],"edges":[],"templates":[]}');
    var count=0;

    var setOtherDetails=function(){
        templateDetailsJSON.description=templateWiringJson.Description[0].Description;
        templateDetailsJSON.name=templateWiringJson.name;
        templateDetailsJSON.from=templateWiringJson.from;
    };
    var setNodes=function(obj,parentId,templates){
        if(obj.template!=undefined){
            for(var i in obj.template){
                var templateObj=obj.template[i];
                var order=templateObj.type;
                var name=templateObj.template;
                templateDetailsJSON.nodes.push({"id" : count.toString(),"order" : order,"type" : "template","parent" : parentId,"name" : name});
                for(var j in templates){
                    if(templates[j].name==name) {
                        var conditions = setConditions(templates[j].ConditionParameters[0]);
                        if (templates[j].Parameters != undefined) {
                            var parameters = setParameters(templates[j].Parameters[0].DirectParameter);
                            templateDetailsJSON.templates.push({
                                "id": count.toString(),
                                "name": name,
                                "type": templates[j].type,
                                "parameters": parameters,
                                "conditionParameters": conditions
                            });
                        }
                        else{
                            templateDetailsJSON.templates.push({
                                "id": count.toString(),
                                "name": name,
                                "type": templates[j].type,
                                "conditionParameters": conditions
                            });
                        }
                    }
                }
                ++count;
            }
        }
        if(obj.and!=undefined){
            var andObj=obj.and[0];
            var order=andObj.type;
            templateDetailsJSON.nodes.push({"id" : count.toString(),"order" : order,"type" : "and","parent" : parentId,"name" : "and"});
            var parent=count.toString();
            ++count;
            setNodes(andObj,parent,templates);
        }
        if(obj.or!=undefined){
            var orObj=obj.or[0];
            var order=orObj.type;
            templateDetailsJSON.nodes.push({"id" : count.toString(),"order" : order,"type" : "or","parent" : parentId,"name" : "or"});
            var parent=count.toString();
            ++count;
            setNodes(orObj,parent,templates);
        }

    };

    var setEdges=function(){
        var nodes=templateDetailsJSON.nodes;
        var edges=templateDetailsJSON.edges;
        var parent,child;
        for(var i in nodes){
            parent=nodes[i].parent;
            child=nodes[i].id;
            if(parent=="null"){
                continue;
            }
            else{
                edges.push({"from":parent,"to":child});
            }
        }
    }

    var setParameters=function(parameterDetails){
        var parameters=[];
        for(var i in parameterDetails){
            parameters.push({"name":parameterDetails[i].name,"value":parameterDetails[i].DirectParameter});
        }
        return parameters;
    }

    var setConditions=function(conditionDetails){
        var conditions={"nodes":[],"conditions":[],"edges":[]};//add nodes,edges in to this
        var count=0;
        var settingConditions=function(obj,parentId){
            if(obj.Parameter!=undefined){
                for(var i in obj.Parameter){
                    var order=obj.Parameter[i].order;
                    var name=obj.Parameter[i].Parameter;
                    conditions.nodes.push({"id":count.toString(),"order":order,"type":"condition","parent":parentId,"name":name});
                    conditions.conditions.push({"id":count.toString(),"value":name});
                    ++count;
                }
            }
            if(obj.AND!=undefined){
                var andObj=obj.AND[0];
                var order=andObj.order;
                conditions.nodes.push({"id":count.toString(),"order":order,"type":"and","parent":parentId,"name":"and"});
                var parent=count.toString();
                ++count;
                settingConditions(andObj,parent);

            }
            if(obj.OR!=undefined){
                var orObj=obj.OR[0];
                var order=orObj.order;
                conditions.nodes.push({"id":count.toString(),"order":order,"type":"or","parent":parentId,"name":"or"});
                var parent=count.toString();
                ++count;
                settingConditions(orObj,parent);

            }
        };
        var settingEdges=function(){
            var nodes=conditions.nodes;
            var edges=conditions.edges;
            var parent,child;
            for(var i in nodes){
                parent=nodes[i].parent;
                child=nodes[i].id;
                if(parent=="null"){
                    continue;
                }
                else{
                    edges.push({"from":parent,"to":child});
                }
            }
        };
        settingConditions(conditionDetails,"null");
        settingEdges();
        return conditions;
    }

    setOtherDetails();
    setNodes(templateWiringJson.TemplateWiring[0],"null",templateWiringJson.Templates[0].Template);
    setEdges();
    return templateDetailsJSON;
};


