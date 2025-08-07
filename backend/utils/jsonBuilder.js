

// function buildJSON(attributes, grouped = {}, attributeMap, withValidation = false) {
//   // Group attributes by their parent ID
//   for (let attr of attributes) {
//     const parent = attr.master_node_attribute_id || 0;
//     if (!grouped[parent]) grouped[parent] = [];
//     grouped[parent].push(attr);
//   }

//   // function buildValidationBase(attrMeta, isMandatory) {
//   //   return {
//   //     data_type: attrMeta?.data_type || 'String',
//   //     is_numeric: attrMeta?.is_numeric ?? false,
//   //     is_date: attrMeta?.is_date ?? false,
//   //     is_timestamp: attrMeta?.is_timestamp ?? false,
//   //     is_mandatory: isMandatory === true || isMandatory === 'TRUE',
//   //     ...(attrMeta?.min_length !== undefined && { min_length: attrMeta.min_length }),
//   //     ...(attrMeta?.max_length !== undefined && { max_length: attrMeta.max_length }),
//   //     ...(attrMeta?.enum?.length && { enum: attrMeta.enum })
//   //   };
//   // }


//   function buildValidationBase(attrMeta, isMandatory) {
//   const base = {
//     data_type: attrMeta?.data_type || 'String',
//     ...(attrMeta?.is_numeric ? { is_numeric: true } : {}),
//     ...(attrMeta?.is_date ? { is_date: true } : {}),
//     ...(attrMeta?.is_timestamp ? { is_timestamp: true } : {}),
//     ...(isMandatory === true || isMandatory === 'TRUE' ? { is_mandatory: true } : {}),
//     ...(attrMeta?.min_length !== undefined && attrMeta.min_length !== null ? { min_length: attrMeta.min_length } : {}),
//     ...(attrMeta?.max_length !== undefined && attrMeta.max_length !== null ? { max_length: attrMeta.max_length } : {}),
//     ...(attrMeta?.enum?.length ? { enum: attrMeta.enum } : {})
//   };
  
//   return base;
// }



//   // function build(parentId) {
//   //   const children = grouped[parentId] || [];
//   //   const obj = {};

//   //   for (let child of children) {
//   //     const {
//   //       attribute_id,
//   //       is_master_node,
//   //       is_master_node_array,
//   //       is_mandatory
//   //     } = child;

//   //     const attrMeta = attributeMap[attribute_id];
//   //     if (!attrMeta) continue;

//   //     const { attribute_name } = attrMeta;

//   //     // Special cases
//   //     if (attribute_name === 'coordinates') {
//   //       obj[attribute_name] = withValidation
//   //         ? [[[buildValidationBase(attrMeta, is_mandatory)]]]
//   //         : [[[null]]];
//   //       continue;
//   //     }

//   //     if (attribute_name === 'crop_image') {
//   //       obj[attribute_name] = [];
//   //       continue;
//   //     }

//   //     if (is_master_node === 1) {
//   //       if (is_master_node_array === 1) {
//   //         // Array type master node
//   //         obj[attribute_name] = withValidation 
//   //           ? [{
//   //               ...buildValidationBase(attrMeta, is_mandatory),
//   //               ...build(attribute_id)
//   //             }]
//   //           : [build(attribute_id)];
//   //       } else {
//   //         // Object type master node
//   //         obj[attribute_name] = withValidation
//   //           ? {
//   //               ...buildValidationBase(attrMeta, is_mandatory),
//   //               ...build(attribute_id)
//   //             }
//   //           : build(attribute_id);
//   //       }
//   //     } else {
//   //       // Leaf node
//   //       obj[attribute_name] = withValidation
//   //         ? buildValidationBase(attrMeta, is_mandatory)
//   //         : null;
//   //     }
//   //   }
//   //   return obj;
//   // }



//   function build(parentId) {
//   const children = grouped[parentId] || [];
//   const obj = {};

//   // Group children by any_of_group
//   const groups = new Map();
//   const normalAttrs = [];

//   for (let child of children) {
//     const groupId = child.any_of_group;
//     if (groupId === null || groupId === undefined) {
//       normalAttrs.push(child);
//     } else {
//       if (!groups.has(groupId)) groups.set(groupId, []);
//       groups.get(groupId).push(child);
//     }
//   }

//   // Handle normal (non-anyOf) attributes
//   for (let child of normalAttrs) {
//     const {
//       attribute_id,
//       is_master_node,
//       is_master_node_array,
//       is_mandatory
//     } = child;

//     const attrMeta = attributeMap[attribute_id];
//     if (!attrMeta) continue;

//     const { attribute_name } = attrMeta;

//     // Special cases
//     if (attribute_name === 'coordinates') {
//       obj[attribute_name] = withValidation
//         ? [[[buildValidationBase(attrMeta, is_mandatory)]]]
//         : [[[null]]];
//       continue;
//     }

//     if (attribute_name === 'crop_image') {
//       obj[attribute_name] = [];
//       continue;
//     }

//     if (is_master_node === 1) {
//       if (is_master_node_array === 1) {
//         obj[attribute_name] = withValidation
//           ? [{
//               ...buildValidationBase(attrMeta, is_mandatory),
//               ...build(attribute_id)
//             }]
//           : [build(attribute_id)];
//       } else {
//         obj[attribute_name] = withValidation
//           ? {
//               ...buildValidationBase(attrMeta, is_mandatory),
//               ...build(attribute_id)
//             }
//           : build(attribute_id);
//       }
//     } else {
//       obj[attribute_name] = withValidation
//         ? buildValidationBase(attrMeta, is_mandatory)
//         : null;
//     }
//   }

//   // Handle anyOf groups
//   for (let [groupId, groupAttrs] of groups.entries()) {
//     const anyOfArray = [];

//     for (let attr of groupAttrs) {
//       const {
//         attribute_id,
//         is_master_node,
//         is_master_node_array,
//         is_mandatory
//       } = attr;

//       const attrMeta = attributeMap[attribute_id];
//       if (!attrMeta) continue;

//       const { attribute_name } = attrMeta;

//       if (is_master_node === 1) {
//         if (is_master_node_array === 1) {
//           anyOfArray.push({
//             [attribute_name]: withValidation
//               ? [{
//                   ...buildValidationBase(attrMeta, is_mandatory),
//                   ...build(attribute_id)
//                 }]
//               : [build(attribute_id)]
//           });
//         } else {
//           anyOfArray.push({
//             [attribute_name]: withValidation
//               ? {
//                   ...buildValidationBase(attrMeta, is_mandatory),
//                   ...build(attribute_id)
//                 }
//               : build(attribute_id)
//           });
//         }
//       } else {
//         anyOfArray.push({
//           [attribute_name]: withValidation
//             ? buildValidationBase(attrMeta, is_mandatory)
//             : null
//         });
//       }
//     }

//     // Attach the anyOf group to the output object
//     obj[`anyOf_${groupId}`] = { anyOf: anyOfArray };
//   }

//   return obj;
// }


//   return build(0);
// }

// module.exports = { buildJSON };





function buildJSON(attributes, grouped = {}, attributeMap, withValidation = false) {
  // Group attributes by their parent ID
  for (let attr of attributes) {
    const parent = attr.master_node_attribute_id || 0;
    if (!grouped[parent]) grouped[parent] = [];
    grouped[parent].push(attr);
  }

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

    // Group children by any_of_group
    const groups = new Map();
    const normalAttrs = [];

    for (let child of children) {
      const groupId = child.any_of_group;
      if (groupId === null || groupId === undefined) {
        normalAttrs.push(child);
      } else {
        if (!groups.has(groupId)) groups.set(groupId, []);
        groups.get(groupId).push(child);
      }
    }

    // Handle normal (non-anyOf) attributes
    for (let child of normalAttrs) {
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
          obj[attribute_name] = withValidation
            ? [{
                ...buildValidationBase(attrMeta, is_mandatory),
                ...build(attribute_id)
              }]
            : [build(attribute_id)];
        } else {
          obj[attribute_name] = withValidation
            ? {
                ...buildValidationBase(attrMeta, is_mandatory),
                ...build(attribute_id)
              }
            : build(attribute_id);
        }
      } else {
        obj[attribute_name] = withValidation
          ? buildValidationBase(attrMeta, is_mandatory)
          : null;
      }
    }

    // Handle anyOf groups
    if (groups.size > 0) {
      const anyOfArray = [];

      for (let groupAttrs of groups.values()) {
        const groupObj = {};

        for (let attr of groupAttrs) {
          const {
            attribute_id,
            is_master_node,
            is_master_node_array,
            is_mandatory
          } = attr;

          const attrMeta = attributeMap[attribute_id];
          if (!attrMeta) continue;

          const { attribute_name } = attrMeta;

          if (is_master_node === 1) {
            if (is_master_node_array === 1) {
              groupObj[attribute_name] = withValidation
                ? [{
                    ...buildValidationBase(attrMeta, is_mandatory),
                    ...build(attribute_id)
                  }]
                : [build(attribute_id)];
            } else {
              groupObj[attribute_name] = withValidation
                ? {
                    ...buildValidationBase(attrMeta, is_mandatory),
                    ...build(attribute_id)
                  }
                : build(attribute_id);
            }
          } else {
            groupObj[attribute_name] = withValidation
              ? buildValidationBase(attrMeta, is_mandatory)
              : null;
          }
        }

        anyOfArray.push(groupObj);
      }

      obj["anyOf"] = anyOfArray;
    }

    return obj;
  }

  return build(0);
}

module.exports = { buildJSON };
