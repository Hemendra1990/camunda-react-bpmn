import React, { useState, useEffect } from "react";
import BpmnModeler from "bpmn-js/lib/Modeler";
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  // use Camunda Platform properties provider
  CamundaPlatformPropertiesProviderModule,
} from "bpmn-js-properties-panel";

import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js-properties-panel/dist/assets/properties-panel.css";
import "./App.css";

// use Camunda BPMN namespace
import CamundaModdleDescriptor from "camunda-bpmn-moddle/resources/camunda.json";
import axios from "axios";

function App() {
  const [modeler, setModeler] = useState(null);
  const [processName, setProcessName] = useState("");
  const [showDeploymentDropdown, setShowDeploymentDropdown] = useState(false);
  const [deployments, setDeployments] = useState([]);
  const [prcessDefId, setProcessDefId] = useState(undefined);
  const [processInstance, setProcessInstance] = useState();
  const [createFlowFlag, setCreateFlowFlag] = useState(false);

  useEffect(() => {
    if(createFlowFlag) {
      const container = document.querySelector(".bpmn-container");

    const newModeler = new BpmnModeler({
      container,
      propertiesPanel: {
        parent: "#properties",
      },
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        CamundaPlatformPropertiesProviderModule,
      ],
      moddleExtensions: {
        camunda: CamundaModdleDescriptor,
      },
    });

    setModeler(newModeler);

    return () => newModeler.destroy();
    }
  }, [createFlowFlag]);

  useEffect(() => {
    if (modeler) {
      console.log(CamundaModdleDescriptor);
      modeler.createDiagram();
    }
  }, [modeler]);

  const createDiagram = () => {
    modeler.createDiagram();
  };

  const validateModel = () => {
    modeler.saveXML((err, xml) => {
      if (err) {
        console.error("Error exporting diagram:", err);
        return;
      }
      const issues = null;

      if (issues && issues.length) {
        console.error("Model validation errors:", issues);
        return;
      }

      console.log("Model is valid!");
    });
  };

  const exportDiagram = () => {
    modeler.saveXML((err, xml) => {
      if (err) {
        console.error("Error exporting diagram:", err);
        return;
      }
      console.log("Diagram XML:", xml);

      let data = JSON.stringify({
        bpmn: xml,
        processName,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "http://localhost:9010/workflow/save",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  const getAllDeployments = () => {
    axios.get("http://localhost:9010/workflow/deployment").then((response) => {
      setShowDeploymentDropdown(true);
      setDeployments(response.data);
      console.log("All Deployments", response.data);
    });
  };

  const handleProcessChange = (e) => {
    console.log(e.target.value);
    setProcessDefId(e.target.value);
  };

  const startProcess = () => {
    if (prcessDefId) {
      const input = prcessDefId;
      const regex = /^.*:(\w{8}-\w{4}-\w{4}-\w{4}-\w{12})$/;
      const match = input.match(regex);
      const output = match ? match[1] : null;
      console.log(output); // "bcbfb4ee-ebed-11ed-b6ac-ced0cc1d8c70"

      axios
        .get(`http://localhost:9010/workflow/start/${output}}`)
        .then((response) => {
          console.log(response.data);
          setProcessInstance(response.data);
        });
    }
  };

  const renderFlowBuilder = () => {
    setCreateFlowFlag(true);
  };

  const preStyle = {
    backgroundColor: "#f4f4f4",
    padding: "10px",
    borderRadius: "5px",
    overflowX: "auto",
    fontFamily: "monospace",
  };

  return (
    <>
      <input
        placeholder="Enter process file name"
        type="text"
        value={processName}
        onChange={(e) => setProcessName(e.target.value)}
      />
      &nbsp;&nbsp;&nbsp;&nbsp;
      <button onClick={validateModel}>Validate Model</button>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <button onClick={getAllDeployments}>Get All Flows</button>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <button onClick={exportDiagram}>Save Flow</button>
      &nbsp;&nbsp;&nbsp;&nbsp;
      {showDeploymentDropdown && (
        <>
          <select onChange={handleProcessChange}>
            <option value="">Select Process to Start(For testing)</option>
            {deployments.map((deployment) => {
              return (
                <option
                  key={deployment.processDefinitionId}
                  value={deployment.processDefinitionId}
                >
                  {deployment.processDefinitionName}
                </option>
              );
            })}
          </select>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <button onClick={startProcess}>Start Process</button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <pre style={preStyle}>
            <code>{processInstance}</code>
          </pre>
        </>
      )}
      { createFlowFlag && (
        <div className="App">
          <div
            className="bpmn-container"
            style={{ width: "80%", height: "80%" }}
          ></div>
          <div id="properties" style={{ width: "20%", height: "80%" }}></div>
        </div>
      )}
      <button onClick={renderFlowBuilder}>Create Flow/Process</button>
    </>
  );
}

export default App;