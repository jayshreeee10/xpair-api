// function buildJSON(attributes, grouped = {}, attributeMap, withValidation = false) {
//   // Group attributes by their parent ID and sort by placement_sequence
//   for (let attr of attributes) {
//     const parent = attr.master_node_attribute_id || 0;
//     if (!grouped[parent]) grouped[parent] = [];
//     grouped[parent].push(attr);
//   }

//   // Sort all groups by placement_sequence
//   for (const parentId in grouped) {
//     grouped[parentId].sort((a, b) => a.placement_sequence - b.placement_sequence);
//   }

//   function buildValidationBase(attrMeta, isMandatory) {
//     const base = {
//       data_type: attrMeta?.data_type || 'String',
//       ...(attrMeta?.is_numeric ? { is_numeric: true } : {}),
//       ...(attrMeta?.is_date ? { is_date: true } : {}),
//       ...(attrMeta?.is_timestamp ? { is_timestamp: true } : {}),
//       ...(isMandatory === true || isMandatory === 'TRUE' ? { is_mandatory: true } : {}),
//       ...(attrMeta?.min_length !== undefined && attrMeta.min_length !== null ? { min_length: attrMeta.min_length } : {}),
//       ...(attrMeta?.max_length !== undefined && attrMeta.max_length !== null ? { max_length: attrMeta.max_length } : {}),
//       ...(attrMeta?.enum?.length ? { enum: attrMeta.enum } : {})
//     };
//     return base;
//   }

//   function build(parentId) {
//     const children = grouped[parentId] || [];
//     const obj = {};

//     // First pass: Handle normal (non-anyOf) attributes while maintaining order
//     const normalAttrs = children.filter(child => child.any_of_group === null || child.any_of_group === undefined);
    
//     for (let child of normalAttrs) {
//       const {
//         attribute_id,
//         is_master_node,
//         is_master_node_array,
//         is_mandatory
//       } = child;

//       const attrMeta = attributeMap[attribute_id];
//       if (!attrMeta) continue;

//       const { attribute_name } = attrMeta;

//       // Special cases
//       if (attribute_name === 'coordinates') {
//         obj[attribute_name] = withValidation
//           ? [[[buildValidationBase(attrMeta, is_mandatory)]]]
//           : [[[null]]];
//         continue;
//       }

//       if (attribute_name === 'crop_image') {
//         obj[attribute_name] = [];
//         continue;
//       }

//       if (is_master_node === 1) {
//         if (is_master_node_array === 1) {
//           obj[attribute_name] = withValidation
//             ? [{
//                 ...buildValidationBase(attrMeta, is_mandatory),
//                 ...build(attribute_id)
//               }]
//             : [build(attribute_id)];
//         } else {
//           obj[attribute_name] = withValidation
//             ? {
//                 ...buildValidationBase(attrMeta, is_mandatory),
//                 ...build(attribute_id)
//               }
//             : build(attribute_id);
//         }
//       } else {
//         obj[attribute_name] = withValidation
//           ? buildValidationBase(attrMeta, is_mandatory)
//           : null;
//       }
//     }

//     // Second pass: Handle anyOf groups while maintaining their original order
//     const groupAttrs = children.filter(child => child.any_of_group !== null && child.any_of_group !== undefined);
//     const groups = new Map();

//     // Group by any_of_group while maintaining order
//     for (let child of groupAttrs) {
//       const groupId = child.any_of_group;
//       if (!groups.has(groupId)) groups.set(groupId, []);
//       groups.get(groupId).push(child);
//     }

//     if (groups.size > 0) {
//       const anyOfArray = [];

//       // Process groups in order of their first attribute's placement_sequence
//       const sortedGroups = Array.from(groups.entries())
//         .sort(([id1, attrs1], [id2, attrs2]) => 
//           attrs1[0].placement_sequence - attrs2[0].placement_sequence);

//       for (let [groupId, groupAttrs] of sortedGroups) {
//         const groupObj = {};

//         for (let attr of groupAttrs) {
//           const {
//             attribute_id,
//             is_master_node,
//             is_master_node_array,
//             is_mandatory
//           } = attr;

//           const attrMeta = attributeMap[attribute_id];
//           if (!attrMeta) continue;

//           const { attribute_name } = attrMeta;

//           if (is_master_node === 1) {
//             if (is_master_node_array === 1) {
//               groupObj[attribute_name] = withValidation
//                 ? [{
//                     ...buildValidationBase(attrMeta, is_mandatory),
//                     ...build(attribute_id)
//                   }]
//                 : [build(attribute_id)];
//             } else {
//               groupObj[attribute_name] = withValidation
//                 ? {
//                     ...buildValidationBase(attrMeta, is_mandatory),
//                     ...build(attribute_id)
//                   }
//                 : build(attribute_id);
//             }
//           } else {
//             groupObj[attribute_name] = withValidation
//               ? buildValidationBase(attrMeta, is_mandatory)
//               : null;
//           }
//         }

//         anyOfArray.push(groupObj);
//       }

//       // Find the correct position for the anyOf group based on placement_sequence
//       const firstGroupAttr = groupAttrs[0];
//       let inserted = false;

//       // Create a new object to maintain order
//       const orderedObj = {};
//       const keys = Object.keys(obj);

//       for (let key of keys) {
//         const attr = normalAttrs.find(a => attributeMap[a.attribute_id]?.attribute_name === key);
//         if (attr && firstGroupAttr.placement_sequence < attr.placement_sequence && !inserted) {
//           orderedObj["anyOf"] = anyOfArray;
//           inserted = true;
//         }
//         orderedObj[key] = obj[key];
//       }

//       if (!inserted) {
//         orderedObj["anyOf"] = anyOfArray;
//       }

//       return orderedObj;
//     }

//     return obj;
//   }

//   return build(0);
// }

// module.exports = { buildJSON };





function buildJSON(attributes, grouped = {}, attributeMap, withValidation = false) {
  // Group attributes by their parent ID and sort by placement_sequence
  for (let attr of attributes) {
    const parent = attr.master_node_attribute_id || 0;
    if (!grouped[parent]) grouped[parent] = [];
    grouped[parent].push(attr);
  }

  // Sort all groups by placement_sequence
  for (const parentId in grouped) {
    grouped[parentId].sort((a, b) => a.placement_sequence - b.placement_sequence);
  }

  function buildValidationBase(attrMeta, isMandatory, tableName, tableColumnName) {
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
    
    // Add table_column in the format "table.column" if both are available
    if (tableName && tableColumnName) {
      base.table_column = `${tableName}.${tableColumnName}`;
    }
    
    return base;
  }

  function build(parentId) {
    const children = grouped[parentId] || [];
    const obj = {};

    // First pass: Handle normal (non-anyOf) attributes while maintaining order
    const normalAttrs = children.filter(child => child.any_of_group === null || child.any_of_group === undefined);
    
    for (let child of normalAttrs) {
      const {
        attribute_id,
        is_master_node,
        is_master_node_array,
        is_mandatory,
        table_name,
        table_column_name
      } = child;

      const attrMeta = attributeMap[attribute_id];
      if (!attrMeta) continue;

      const { attribute_name } = attrMeta;

      // Special cases
      if (attribute_name === 'coordinates') {
        obj[attribute_name] = withValidation
          ? [[[buildValidationBase(attrMeta, is_mandatory, table_name, table_column_name)]]]
          : [[[null]]];
        continue;
      }

      if (attribute_name === 'crop_image') {
        obj[attribute_name] = [];
        continue;
      }

      if (is_master_node === 1) {
        if (is_master_node_array === 1) {
          obj[attribute_name] = withValidation
            ? [{
                ...buildValidationBase(attrMeta, is_mandatory, table_name, table_column_name),
                ...build(attribute_id)
              }]
            : [build(attribute_id)];
        } else {
          obj[attribute_name] = withValidation
            ? {
                ...buildValidationBase(attrMeta, is_mandatory, table_name, table_column_name),
                ...build(attribute_id)
              }
            : build(attribute_id);
        }
      } else {
        obj[attribute_name] = withValidation
          ? buildValidationBase(attrMeta, is_mandatory, table_name, table_column_name)
          : null;
      }
    }

    // Second pass: Handle anyOf groups while maintaining their original order
    const groupAttrs = children.filter(child => child.any_of_group !== null && child.any_of_group !== undefined);
    const groups = new Map();

    // Group by any_of_group while maintaining order
    for (let child of groupAttrs) {
      const groupId = child.any_of_group;
      if (!groups.has(groupId)) groups.set(groupId, []);
      groups.get(groupId).push(child);
    }

    if (groups.size > 0) {
      const anyOfArray = [];

      // Process groups in order of their first attribute's placement_sequence
      const sortedGroups = Array.from(groups.entries())
        .sort(([id1, attrs1], [id2, attrs2]) => 
          attrs1[0].placement_sequence - attrs2[0].placement_sequence);

      for (let [groupId, groupAttrs] of sortedGroups) {
        const groupObj = {};

        for (let attr of groupAttrs) {
          const {
            attribute_id,
            is_master_node,
            is_master_node_array,
            is_mandatory,
            table_name,
            table_column_name
          } = attr;

          const attrMeta = attributeMap[attribute_id];
          if (!attrMeta) continue;

          const { attribute_name } = attrMeta;

          if (is_master_node === 1) {
            if (is_master_node_array === 1) {
              groupObj[attribute_name] = withValidation
                ? [{
                    ...buildValidationBase(attrMeta, is_mandatory, table_name, table_column_name),
                    ...build(attribute_id)
                  }]
                : [build(attribute_id)];
            } else {
              groupObj[attribute_name] = withValidation
                ? {
                    ...buildValidationBase(attrMeta, is_mandatory, table_name, table_column_name),
                    ...build(attribute_id)
                  }
                : build(attribute_id);
            }
          } else {
            groupObj[attribute_name] = withValidation
              ? buildValidationBase(attrMeta, is_mandatory, table_name, table_column_name)
              : null;
          }
        }

        anyOfArray.push(groupObj);
      }

      // Find the correct position for the anyOf group based on placement_sequence
      const firstGroupAttr = groupAttrs[0];
      let inserted = false;

      // Create a new object to maintain order
      const orderedObj = {};
      const keys = Object.keys(obj);

      for (let key of keys) {
        const attr = normalAttrs.find(a => attributeMap[a.attribute_id]?.attribute_name === key);
        if (attr && firstGroupAttr.placement_sequence < attr.placement_sequence && !inserted) {
          orderedObj["anyOf"] = anyOfArray;
          inserted = true;
        }
        orderedObj[key] = obj[key];
      }

      if (!inserted) {
        orderedObj["anyOf"] = anyOfArray;
      }

      return orderedObj;
    }

    return obj;
  }

  return build(0);
}

module.exports = { buildJSON };