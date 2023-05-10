const validateAndFindNode = (xmlString, nodeName, value) => {
    try {
      // Parse the XML string into a DOM object
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
  
      // Check for parsing errors
      const parseError = xmlDoc.getElementsByTagName('parsererror');
      if (parseError.length > 0) {
        throw new Error('XML parsing error');
      }
  
      // Find the node with the specified value
      const nodes = xmlDoc.getElementsByTagName(nodeName);
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].textContent === value) {
          console.log(`Found node "${nodeName}" with value "${value}"`);
          console.log(nodes[i]);
          return nodes[i];
        }
      }
  
      console.log(`Node "${nodeName}" with value "${value}" not found`);
      return null;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  export default validateAndFindNode;
  