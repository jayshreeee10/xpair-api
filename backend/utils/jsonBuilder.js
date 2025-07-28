function buildJSON(attributes, grouped = {}, attributeMap, withValidation = false) {
  for (let attr of attributes) {
    const parent = attr.master_node_attribute_id || 0;
    if (!grouped[parent]) grouped[parent] = [];
    grouped[parent].push(attr);
  }

  const typeHandlers = {
    Object: id => build(id),
    Array: id => {
      const built = build(id);
      if (attributeMap[id]?.attribute_name === 'coordinates') {
        return withValidation
          ? [[[buildCoordinateValidation(attributeMap[id])]]]
          : [[[null]]]; // ← null instead of 0
      }
      return [built];
    },
    default: () => null
  };

  function buildCoordinateValidation(attrMeta) {
    return {
      data_type: attrMeta?.data_type || 'Number',
      is_numeric: attrMeta?.is_numeric ?? true,
      is_date: attrMeta?.is_date ?? false,
      is_timestamp: attrMeta?.is_timestamp ?? false,
      is_mandatory: attrMeta?.is_mandatory === true || attrMeta?.is_mandatory === 'TRUE'
    };
  }

  function build(parentId) {
    const children = grouped[parentId] || [];
    const obj = {};

    for (let child of children) {
      const {
        attribute_id,
        is_master_node,
        is_mandatory
      } = child;

      const attrMeta = attributeMap[attribute_id];
      const {
        attribute_name,
        data_type,
        min_length,
        max_length,
        is_numeric,
        is_date,
        is_timestamp,
        enum: enumValues
      } = attrMeta;

      if (attribute_name === 'coordinates') {
        obj[attribute_name] = withValidation
          ? [[[buildCoordinateValidation(attrMeta)]]]
          : [[[null]]]; // ← changed from 0 to null
        continue;
      }

      if (attribute_name === 'crop_image') {
        obj[attribute_name] = [];
        continue;
      }

      const base = {
        data_type,
        is_numeric,
        is_date,
        is_timestamp,
        is_mandatory: is_mandatory === true || is_mandatory === 'TRUE'
      };

      if (min_length !== null && min_length !== undefined) base.min_length = min_length;
      if (max_length !== null && max_length !== undefined) base.max_length = max_length;
      if (enumValues?.length) base.enum = enumValues;

      const handler = typeHandlers[data_type] || typeHandlers.default;

      //   obj[attribute_name] =
      //     is_master_node === 1
      //       ? (data_type === 'Object' || data_type === 'Array'
      //           ? handler(attribute_id)
      //           : withValidation ? base : null)
      //       : (withValidation ? base : null);
      // }
      if (is_master_node === 1) {
        if (data_type === 'Object') {
          obj[attribute_name] = build(attribute_id); // just object
        } else if (data_type === 'Array') {
          if (child.is_master_node_array === 1) {
            obj[attribute_name] = [build(attribute_id)]; // array of object
          } else {
            obj[attribute_name] = build(attribute_id); // object, not array
          }
        } else {
          obj[attribute_name] = withValidation ? base : null;
        }
      } else {
        obj[attribute_name] = withValidation ? base : null;
      }

    }
      return obj;
    }

    return build(0);
  }

  module.exports = { buildJSON };
