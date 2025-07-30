// function buildJSON(attributes, grouped = {}, attributeMap, withValidation = false) {
//   for (let attr of attributes) {
//     const parent = attr.master_node_attribute_id || 0;
//     if (!grouped[parent]) grouped[parent] = [];
//     grouped[parent].push(attr);
//   }

//   const typeHandlers = {
//     Object: id => build(id),
//     Array: id => {
//       const built = build(id);
//       if (attributeMap[id]?.attribute_name === 'coordinates') {
//         return withValidation
//           ? [[[buildCoordinateValidation(attributeMap[id])]]]
//           : [[[null]]]; // ← null instead of 0
//       }
//       return [built];
//     },
//     default: () => null
//   };

//   function buildValidation(attrMeta) {
//   return {
//     data_type: attrMeta?.data_type,
//     is_numeric: attrMeta?.is_numeric ?? false,
//     is_date: attrMeta?.is_date ?? false,
//     is_timestamp: attrMeta?.is_timestamp ?? false,
//     is_mandatory: attrMeta?.is_mandatory === true || attrMeta?.is_mandatory === 'TRUE',
//     ...(attrMeta?.min_length != null && { min_length: attrMeta.min_length }),
//     ...(attrMeta?.max_length != null && { max_length: attrMeta.max_length }),
//     ...(attrMeta?.enum?.length ? { enum: attrMeta.enum } : {})
//   };
// }


//   function buildCoordinateValidation(attrMeta) {
//     return {
//       data_type: attrMeta?.data_type || 'Number',
//       is_numeric: attrMeta?.is_numeric ?? true,
//       is_date: attrMeta?.is_date ?? false,
//       is_timestamp: attrMeta?.is_timestamp ?? false,
//       is_mandatory: attrMeta?.is_mandatory === true || attrMeta?.is_mandatory === 'TRUE'
//     };
//   }

//   function build(parentId) {
//   const children = grouped[parentId] || [];
//   const obj = {};

//   for (let child of children) {
//     const {
//       attribute_id,
//       is_master_node,
//       is_master_node_array
//     } = child;

//     const attrMeta = attributeMap[attribute_id];
//     const {
//       attribute_name,
//       data_type,
//       min_length,
//       max_length,
//       is_numeric,
//       is_date,
//       is_timestamp,
//       enum: enumValues
//     } = attrMeta;

//     if (attribute_name === 'coordinates') {
//       obj[attribute_name] = withValidation
//         ? [[[buildCoordinateValidation(attrMeta)]]]
//         : [[[null]]];
//       continue;
//     }

//     if (attribute_name === 'crop_image') {
//       obj[attribute_name] = [];
//       continue;
//     }

//     const base = buildValidation(attrMeta);

//     if (is_master_node === 1) {
//       const grandChildren = grouped[attribute_id] || [];
//       const isLeaf = grandChildren.length > 0 && grandChildren.every(gc => gc.is_master_node === 0);

//       if (is_master_node_array === 1) {
//         if (isLeaf) {
//           obj[attribute_name] = withValidation
//             ? [grandChildren.map(gc => buildValidation(attributeMap[gc.attribute_id]))]
//             : [{}];
//         } else {
//           obj[attribute_name] = [build(attribute_id)];
//         }
//       } else {
//         obj[attribute_name] = build(attribute_id);
//       }

//     } else {
//       obj[attribute_name] = withValidation ? base : null;
//     }
//   }

//   return obj;
// }


//     return build(0);
//   }

//   module.exports = { buildJSON };



function buildJSON(attributes, grouped = {}, attributeMap, withValidation = false) {
  // Group attributes by their parent ID
  for (let attr of attributes) {
    const parent = attr.master_node_attribute_id || 0;
    if (!grouped[parent]) grouped[parent] = [];
    grouped[parent].push(attr);
  }

  // function buildValidationBase(attrMeta, isMandatory) {
  //   return {
  //     data_type: attrMeta?.data_type || 'String',
  //     is_numeric: attrMeta?.is_numeric ?? false,
  //     is_date: attrMeta?.is_date ?? false,
  //     is_timestamp: attrMeta?.is_timestamp ?? false,
  //     is_mandatory: isMandatory === true || isMandatory === 'TRUE',
  //     ...(attrMeta?.min_length !== undefined && { min_length: attrMeta.min_length }),
  //     ...(attrMeta?.max_length !== undefined && { max_length: attrMeta.max_length }),
  //     ...(attrMeta?.enum?.length && { enum: attrMeta.enum })
  //   };
  // }


  function buildValidationBase(attrMeta, isMandatory) {
  const base = {
    data_type: attrMeta?.data_type || 'String',
    ...(attrMeta?.is_numeric ? { is_numeric: true } : {}),
    ...(attrMeta?.is_date ? { is_date: true } : {}),
    ...(attrMeta?.is_timestamp ? { is_timestamp: true } : {}),
    ...(isMandatory === true || isMandatory === 'TRUE' ? { is_mandatory: true } : {}),
    ...(attrMeta?.min_length !== undefined && attrMeta.min_length !== null ? { min_length: attrMeta.min_length } : {}),
    ...(attrMeta?.max_length !== undefined && attrMeta.max_length !== null ? { max_length: attrMeta.max_length } : {}),
    ...(attrMeta?.enum?.length ? { enum: attrMeta.enum } : {})
  };
  
  return base;
}



  function build(parentId) {
    const children = grouped[parentId] || [];
    const obj = {};

    for (let child of children) {
      const {
        attribute_id,
        is_master_node,
        is_master_node_array,
        is_mandatory
      } = child;

      const attrMeta = attributeMap[attribute_id];
      if (!attrMeta) continue;

      const { attribute_name } = attrMeta;

      // Special cases
      if (attribute_name === 'coordinates') {
        obj[attribute_name] = withValidation
          ? [[[buildValidationBase(attrMeta, is_mandatory)]]]
          : [[[null]]];
        continue;
      }

      if (attribute_name === 'crop_image') {
        obj[attribute_name] = [];
        continue;
      }

      if (is_master_node === 1) {
        if (is_master_node_array === 1) {
          // Array type master node
          obj[attribute_name] = withValidation 
            ? [{
                ...buildValidationBase(attrMeta, is_mandatory),
                ...build(attribute_id)
              }]
            : [build(attribute_id)];
        } else {
          // Object type master node
          obj[attribute_name] = withValidation
            ? {
                ...buildValidationBase(attrMeta, is_mandatory),
                ...build(attribute_id)
              }
            : build(attribute_id);
        }
      } else {
        // Leaf node
        obj[attribute_name] = withValidation
          ? buildValidationBase(attrMeta, is_mandatory)
          : null;
      }
    }
    return obj;
  }

  return build(0);
}

module.exports = { buildJSON };
