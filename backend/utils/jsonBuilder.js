function buildJSON(attributes, grouped = {}, attributeMap) {
  const result = {};

  // First, group by master_node_attribute_id
  for (let attr of attributes) {
    const parent = attr.master_node_attribute_id || 0;
    if (!grouped[parent]) grouped[parent] = [];
    grouped[parent].push(attr);
  }

  function build(parentId) {
    const children = grouped[parentId] || [];
    const obj = {};

    for (let child of children) {
      const attrDef = attributeMap[child.attribute_id];
      const attrName = attrDef.attribute_name;
      const attrType = attrDef.attribute_type;

      if (child.is_master_node === 1) {
        if (attrType === 'Object') {
          obj[attrName] = build(child.attribute_id);
        } else if (attrType === 'Array') {
          obj[attrName] = [build(child.attribute_id)];
        }
      } else {
        obj[attrName] = null;
      }
    }

    return obj;
  }

  return build(0);
}

module.exports = { buildJSON };
