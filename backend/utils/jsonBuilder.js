// function buildJSON(attributes, grouped = {}, attributeMap) {
//   const result = {};

//   // First, group by master_node_attribute_id
//   for (let attr of attributes) {
//     const parent = attr.master_node_attribute_id || 0;
//     if (!grouped[parent]) grouped[parent] = [];
//     grouped[parent].push(attr);
//   }

//   const typeHandlers = {
//     Object: id => build(id),
//     Array: id => [build(id)],
//     default: () => null
//   };

//   function build(parentId) {
//     const children = grouped[parentId] || [];
//     const obj = {};

//     for (let child of children) {
//       const { attribute_id, is_master_node } = child;
//       const { attribute_name, attribute_type } = attributeMap[attribute_id];

//       const handler = typeHandlers[attribute_type] || typeHandlers.default;
//       obj[attribute_name] =
//         is_master_node === 1 ? handler(attribute_id) : null;
//     }


//     return obj;
//   }

//   return build(0);
// }

// module.exports = { buildJSON };






function buildJSON(attributes, grouped = {}, attributeMap) {
  // First, group by master_node_attribute_id
  for (let attr of attributes) {
    const parent = attr.master_node_attribute_id || 0;
    if (!grouped[parent]) grouped[parent] = [];
    grouped[parent].push(attr);
  }

  const typeHandlers = {
    Object: id => build(id),
    Array: id => {
      const built = build(id);
      // Special handling for GeoJSON coordinates
      if (attributeMap[id]?.attribute_name === 'coordinates') {
        return [[]]; // Proper empty GeoJSON array structure for MultiPolygon
      }
      return [built];
    },
    String: () => null,
    Numeric: () => null,
    default: () => null
  };

  function build(parentId) {
    const children = grouped[parentId] || [];
    const obj = {};

    for (let child of children) {
      const { attribute_id, is_master_node } = child;
      const { attribute_name, attribute_type } = attributeMap[attribute_id];

      // Special case for coordinates - ensure proper GeoJSON structure
      if (attribute_name === 'coordinates') {
        obj[attribute_name] = [[]]; // Empty but valid MultiPolygon structure
        continue;
      }

      // Special case for crop_image array
      if (attribute_name === 'crop_image') {
        obj[attribute_name] = [];
        continue;
      }

      const handler = typeHandlers[attribute_type] || typeHandlers.default;
      obj[attribute_name] = is_master_node === 1 ? handler(attribute_id) : null;
    }

    // Ensure plot_geometry has proper structure if it exists
    // if (obj.plot_geometry) {
    //   obj.plot_geometry.type = obj.plot_geometry.type || 'MultiPolygon';
    //   obj.plot_geometry.coordinates = obj.plot_geometry.coordinates || [[]];
    // }

    return obj;
  }

  return build(0);
}

module.exports = { buildJSON };
