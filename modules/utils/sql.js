let SqlString = require("sqlstring");

SqlString.trim = (val) => {
  if (val.charAt(0) == "'")
    return val.substring(1, val.length-1);
  else
    return val;
};

SqlString.escapeLike = (val, any_start = true, any_end = true, force_to_lower = true) => {
  // normal escape
  let res = SqlString.escape(val);
  // unwrap ''
  res = SqlString.trim(res);
  // escape % and _
  res = res.replace(/[%_]/g, "\\$&");
  // wrap with % for LIKE
  res = (any_start ? "%" : "") + res + (any_end ? "%" : "");
  // wrap ''
  res = "'" + res + "'";
  // tolower if needed
  if (force_to_lower)
    res = 'lower('+res+')';
  return res;
};

SqlString.wrapIfComplexQuery = (queryItem) => {
  
  //console.log("query:"+queryItem)
  //console.log(queryItem);
  if (queryItem.startsWith("lower({#") || queryItem.startsWith("{#")){
    let complexQueryField = ""; 
    if (queryItem.startsWith("lower({#")){
      //console.log("starts with lower")
      complexQueryField = queryItem.substring(6, queryItem.indexOf("}")+1);
    }
    else {
      //console.log("not lower")
      complexQueryField = queryItem.substring(0, queryItem.indexOf("}")+1);
    }
    //console.log("query wrapped:"+(complexQueryField + ".begin") + queryItem + (complexQueryField + ".end"))
    return (complexQueryField + ".begin") + queryItem + (complexQueryField + ".end")
  }
  //console.log("query no wrapped:"+queryItem)
  return queryItem;
};

export {SqlString};
