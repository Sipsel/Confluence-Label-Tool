function search_form_submit()
{
   let search_type = $('#search-input-type').val()
   let search_string = $('#search-input-text').val()
   if(search_type=="label")
   {
      console.log("true")
      AP.request({
         url: `/rest/api/content/search?cql=label=${search_string}`,
          success: function(response) {
            response = JSON.parse(response);
            //console.log(response)
            if(response.size > 0){
               let x = response.results.length
              
               let result_hmtl = `<tr><th>Title</th><th>ID</th><th>Select for add/remove</th><th>Space</th><th>Selected Label</th></tr><input id="n-results" name="n-results" type="hidden" value=${x}><input id="selected-label" name="selected-label" type="hidden" value="${search_string}">`
               for(let i=0;i<x;i++)
               {
                  let space = response.results[i]._expandable.space
                  space = space.slice(16,space.length)
                  result_hmtl+=`<tr id="found-label-${i}"  name="found-label-${i}"><td><a href="${response._links.base + response.results[i]._links.tinyui}" target="_blank">${response.results[i].title}</td><td id="found-label-${i}-id"  name="found-label-${i}-id">${response.results[i].id}</td><td><input type="checkbox" id="found-label-${i}-selected"  name="found-label-${i}-selected"></td><td>${space}</td><td>${search_string}</td>`;
               }
               $('#label-search-results').html(
                  `<ul>${result_hmtl}</ul>`
                ) 
               } else {
                  $('#label-search-results').html("<b>No results found.</b>");
               }
          },
          error: function() {
            console.log(arguments);
          }  
        });
   }
   else{
      AP.request({
         url: `/rest/api/content?${search_type}=${search_string}&type=page`,
          success: function(response) {
            response = JSON.parse(response);
            //console.log(response)
            if(response.size > 0){
               let x = response.results.length
              
               let result_hmtl = `<tr><th>Title</th><th>ID</th><th>Select for add/remove</th><th>Space</th><th>Selected Label</th></tr><input id="n-results" name="n-results" type="hidden" value=${x}><input id="selected-label" name="selected-label" type="hidden" value="${search_string}">`
               for(let i=0;i<x;i++)
               {
                  let space = response.results[i]._expandable.space
                  space = space.slice(16,space.length)
                  result_hmtl+=`<tr id="found-label-${i}"  name="found-label-${i}"><td><a href="${response._links.base + response.results[i]._links.tinyui}" target="_blank">${response.results[i].title}</td><td id="found-label-${i}-id"  name="found-label-${i}-id">${response.results[i].id}</td><td><input type="checkbox" id="found-label-${i}-selected"  name="found-label-${i}-selected"></td><td>${space}</td><td>none</td>`;
               }
               $('#label-search-results').html(
                  `<ul>${result_hmtl}</ul>`
                ) 
               } else {
                  $('#label-search-results').html("<b>No results found.</b>");
               }
          },
          error: function() {
            console.log(arguments);
          }  
        });
   }
   
   

   return false;
}

function add_form_submit()
{
   let num_of_results = $('#n-results').val();
   let selected_label = $('#selected-label').val()
   let new_label = $('#label-add-input').val()
   if(num_of_results <=0)
   {
      window.alert("no search results found")
      return false;
   }
   if(!(window.confirm(`Are you sure you want to add the label: "${new_label}" from the selected Pages?`)))
   {
      return false;
   }
   var jsonData = 
   {
      "prefix":"global",
      "name": new_label
   }
   for(let i = 0;i<num_of_results;i++)
   {
      if($(`#found-label-${i}-selected`)[0].checked)
      {
         AP.request({
            url: '/rest/api/content/' + $(`#found-label-${i}-id`).html() + '/label' ,
            type: "POST",
            data: JSON.stringify(jsonData),
            contentType: 'application/json',
            headers: {
               Accept: 'application/json'
            },
            success: function(response) {
               $('#label-search-results').html("");
               //window.alert(`Label added on the ${i} page`);
               //console.log(response)
             },
             error: function() {
               console.log(arguments);
             }  
           });
           
      }
   }
   $('#label-add-input').val("")
   return false;
}
function delete_form_submit()
{
   let num_of_results = $('#n-results').val();
   let selected_label = $('#selected-label').val()
   
   if(num_of_results <=0)
   {
      window.alert("no search results found")
      return false;
   }
  
   if(!(window.confirm(`Are you sure you want to delete the label: "${selected_label}" from the selected Pages?`)))
   {
      return false;
   }
   
   for(let i = 0;i<num_of_results;i++)
   {
      if($(`#found-label-${i}-selected`)[0].checked)
      {
         console.log("true")
         console.log('/rest/api/content/' + $(`#found-label-${i}-id`).html() + '/label/' + selected_label)
         console.log(selected_label)
         AP.request({
            url: '/rest/api/content/' + $(`#found-label-${i}-id`).html() + '/label/' + selected_label,
            type: "DELETE",
            success: function(response) {
               $('#label-search-results').html("");
               window.alert("Label deleted");
               //console.log(response)
             },
             error: function() {
               console.log(arguments);
             }  
           });
           
      }
   }
   return false;
}
