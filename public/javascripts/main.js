


const showCreateForm = () => {

   const contentBox = document.getElementById('content-box');
   contentBox.innerHTML = `
       <div class= "container">
           <h1>Create Weight</h1>
           weight :  <input type="Number" id="weight" name="weight" required><br><br>
           date:  <input type="date" id="date" name="idate">
           <button type="button" onclick="createWeight()">Create Weight</button>
       </div>
      
   `;

   const weightList = document.getElementById('weight-table');
   weightList.style.display = 'none';

   const weightCalculator = document.getElementById('weight-calculator');
   weightCalculator.style.display='none';

};

const createWeight = () => {

   const weight = document.getElementById('weight').value;
  var date = document.getElementById("date").value;
  
   if(date==""){
      date= new Date()
      date.setUTCHours(0,0,0,0)
      
    }

    



   axios.post('/weightAjax/create_weight', {
      weight,
      date
   })
      .then(response => {
         // Handle the response as needed (e.g., show success message)
         console.log('weight created successfully:', response.data);



         getWeightList();
      })
      .catch(error => {
         // Handle errors (e.g., display error message)
         console.error('Error creating weight:', error.response.data);
      });
      const weightCalculator = document.getElementById('weight-calculator');
      weightCalculator.style.display='block';
};

const getWeightList = () => {
   axios.get('/weightAjax/retrieve_weight')
      .then(response => {

         const weightList = document.getElementById('weight-table');
         weightList.innerHTML = '<tr><th>Weight</th><th>Date</th><th colspan="2" style="text-align:center;">Actions</th></tr>';
         
         response.data.forEach(weights => {
            const row = `<tr><td>${weights.weight}</td><td>${weights.date}</td><td><button onclick="showUpdateForm('${weights._id}', '${weights.weight}', '${weights.time}')">Edit</button></td><td><button onclick="showDeleteConfirmation('${weights._id}', '${weights.weight}')">Delete</button></td></tr>`;
            weightList.innerHTML += row;
         });

         weightList.style.display = 'block';

         const contentBox = document.getElementById('content-box');
         contentBox.innerHTML = ``;

        

      })
      .catch(error => {

         console.error('Error getting product list:', error.response.data);
      });
      


      //for calculator

      const weightCalculator = document.getElementById('weight-calculator');
      weightCalculator.innerHTML = `
          <div class= "container mt-5">
              <h1>Calculate Weight</h1>
              first date :  <input type="date" id="firstdate" name="firstdate"   required><br><br> 
              
              second date:  <input type="date" id="seconddate" name="seconddate"   required><br><br>
              <button type="button" class="btn btn-primary" onclick="calculateWeight()">calculateweight</button>
              <p id="showweightdifference"> weight is: </p>
          </div>
`;
         //for calculator end

};

document.addEventListener('DOMContentLoaded', getWeightList);



const showUpdateForm = (weightsId, weightsWeight, weightsDate) => {
   const contentBox = document.getElementById('content-box');
   contentBox.innerHTML = `
       <div class="container">
           <h1>Update Weight</h1>
          Weight: <input type="text" id="update-weight" name="weight" value="${weightsWeight}" required><br><br>
          Date:<input type="date" id="update-date" name="date" value=" value="${weightsDate}">
           
           <button type="button" onclick="updateWeight('${weightsId}')">Update Weight</button>
       </div>
   `;

   const weightList = document.getElementById('weight-table');
   weightList.style.display = "none";

   const createButton = document.getElementById('createbtn');
   createButton.style.display = 'none';

   const weightCalculator = document.getElementById('weight-calculator');
   weightCalculator.style.display='none';

};

const updateWeight = (weightsId) => {

   const updatedWeight = document.getElementById("update-weight").value;
   const updatedDate = document.getElementById("update-date").value;




   axios.post(`/weightAjax/update_weight/${weightsId}`, {
      weight: updatedWeight,
      date: updatedDate
   })

      .then(response => {
         console.log('weight updated successfully;', response.data);

         getWeightList();


         const createButton = document.getElementById('createbtn');
         createButton.style.display = 'block';

      })

      .catch(error => {
         console.error('Error updating weight:', error.response.data);
      });

};

const showDeleteConfirmation = (weightsId, weightsWeight) => {
   const contentBox = document.getElementById('content-box');
   contentBox.innerHTML = `
       <div class="container">
           <h1>Delete Confirmation</h1>
           <p>Are you sure you want to delete this <b>${weightsWeight}</b> weight?</p>
           <button type="button" onclick="confirmDelete('${weightsId}')">Yes, Delete</button>
           <button type="button" onclick="cancelDelete()">Cancel</button>
       </div>
   `;



   const weightList = document.getElementById('weight-table');
   weightList.style.display = 'none';



   const createButton = document.getElementById('createbtn');
   createButton.style.display = 'none';


   const weightCalculator = document.getElementById('weight-calculator');
   weightCalculator.style.display='none';
};




const confirmDelete = (weightsId) => {

   axios.post(`/weightAjax/delete_weight/${weightsId}`)
      .then(response => {

         console.log(response.data.message);

         getWeightList();

         const createButton = document.getElementById('createbtn');
         createButton.style.display = 'block';
      })
      .catch(error => {

         console.error('Error deleting weight:', error.response.data.error);
      });

   const contentBox = document.getElementById('content-box');
   contentBox.innerHTML = '';

   const weightList = document.getElementById('weight-table');
   weightList.style.display = 'block';
};


const calculateWeight=(weightsId)=>{

   const firstdate=document.getElementById('firstdate').value
   const seconddate=document.getElementById('seconddate').value
   
   console.log(firstdate)
   console.log(seconddate)

axios.post(`/weightAjax/calculate_weight/`, {
       firstdate,
       seconddate
    })
    .then(response => {
    console.log('weight finded successfully;', response.data);
   console.log(response.data[0].weight)
  const  firstweight= parseInt(response.data[0].weight)
 const   secondweight=parseInt(response.data[1].weight)
    console.log(firstweight)
    function calculate_weight(firstweight,secondweight){

       let weightdifference= firstweight-secondweight;
       console.log(weightdifference)
       return   document.getElementById('showweightdifference').innerHTML= weightdifference
    }
    
        calculate_weight(firstweight,secondweight);

    
      // const createButton = document.getElementById('createbtn');
      // createButton.style.display = 'block';

 })

}

