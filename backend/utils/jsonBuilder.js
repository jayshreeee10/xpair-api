function buildJSON(attributes, grouped = {}, attributeMap) {
  const result = {};

  // First, group by master_node_attribute_id
  for (let attr of attributes) {
    const parent = attr.master_node_attribute_id || 0;
    if (!grouped[parent]) grouped[parent] = [];
    grouped[parent].push(attr);
  }

  const typeHandlers = {
    Object: id => build(id),
    Array: id => [build(id)],
    default: () => null
  };

  function build(parentId) {
    const children = grouped[parentId] || [];
    const obj = {};

    for (let child of children) {
      const { attribute_id, is_master_node } = child;
      const { attribute_name, attribute_type } = attributeMap[attribute_id];

      const handler = typeHandlers[attribute_type] || typeHandlers.default;
      obj[attribute_name] =
        is_master_node === 1 ? handler(attribute_id) : null;
    }


    return obj;
  }

  return build(0);
}

module.exports = { buildJSON };







