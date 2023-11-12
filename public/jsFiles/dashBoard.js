document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('customDatesBtn').addEventListener('click', function() {
      var modal = new bootstrap.Modal(document.getElementById('datepickerModal'));
      modal.show();
    });

    document.getElementById('customDatesBtn2').addEventListener('click', function() {
      var modal = new bootstrap.Modal(document.getElementById('datepickerModal2'));
      modal.show();
    });
    document.getElementById('datePickerForm').addEventListener('submit', function (event) {
      event.preventDefault(); 
      handleCustomDates();
    });
    document.getElementById('datePickerForm2').addEventListener('submit', function (event) {
      event.preventDefault(); 
      handleCustomDates2();
    });
  });

  const handleCustomDates = () => {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const startDateValue = startDateInput.value;
    const endDateValue = endDateInput.value;
    if (!startDateValue || !endDateValue) {
        showAlert("Please select both start and end dates.");
        return;
    }
    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        showAlert("Invalid date format. Please select valid dates.");
        return;
    }
    if (startDate > endDate) {
        showAlert("End date must be greater or equal to the start date.");
        return;
    }
    const today = new Date();
    if (endDate > today) {
        showAlert("End date cannot be a future date.");
        return;
    }
    const form=document.getElementById('datePickerForm')
    form.submit();
    form.reset();
  };
  const handleCustomDates2 = () => {
    const startDateInput = document.getElementById('startDateChart');
    const endDateInput = document.getElementById('endDateChart');
    const startDateValue = startDateInput.value;
    const endDateValue = endDateInput.value;
    if (!startDateValue || !endDateValue) {
        showAlert("Please select both start and end dates.");
        return;
    }
    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        showAlert("Invalid date format. Please select valid dates.");
        return;
    }
    if (startDate > endDate) {
        showAlert("End date must be greater or equal to the start date.");
        return;
    }
    const today = new Date();
    if (endDate > today) {
        showAlert("End date cannot be a future date.");
        return;
    }
    const form=document.getElementById('datePickerForm2')
    salesByRange(startDateValue,endDateValue);
    form.reset();
  };
  
  const dataContainer=document.querySelector(".dataContainer");

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

let decodedDescription = decodeHtml(description);
let parsedDescription = JSON.parse(decodedDescription);
let disc=[];
parsedDescription.forEach(data => {
  disc.push(data.toString())
});
const defaultX=x.split(',')
const defaultY=y.split(',').map(Number)
 function selectMonth(selectedItem) {
  $('.dropdown-toggle').dropdown('toggle');
    fetch('/admin/getByMonth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ month: selectedItem }),
    })
    .then(response => response.json())
    .then(data => {
        if(data.get === true) {
            x = data.x;
            y = data.y;
            let message='Orders Of '+selectedItem;
            const label="Status"
            if((x.length&&y.length)===0){
              message='No Orders In '+selectedItem;
            }
            updateChart(x, y,message,label);
        } else {
            showAlert("Error");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}




 function selectYear(selectedItem) {
  $('.dropdown-toggle').dropdown('toggle');
    fetch('/admin/getByYear', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ year: selectedItem }),
    })
    .then(response => response.json())
    .then(data => {
        if(data.get === true) {
            x = data.x;
            y = data.y;
            const message='Orders Of The Year '+selectedItem;
            const label="Months"
            updateChart(x, y,message,label);
        } else {
            showAlert("Ooops!");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

 function salesByCategory() {
  $('.dropdown-toggle').dropdown('toggle');
    fetch('/admin/salesByCategory')
    .then(response => response.json())
    .then(data => {
        if(data.get === true) {
            x = data.x;
            y = data.y;
            const message='Orders Based On the Category';
            const label="Categories"
            updateChart(x, y,message,label);
        } else {
            showAlert("Ooops!");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

 function salesByRange(start,end) {
  const datepickerModal2 = document.querySelector('.datepickerModal2');
if (datepickerModal2) {
  const modalInstance = new bootstrap.Modal(datepickerModal2);
  datepickerModal2.style.display='none'
  const backdropElement = document.querySelector('.modal-backdrop');
  if (backdropElement) {
    backdropElement.remove();
  }
} else {
  console.error("Modal element not found or is null");
}

    fetch(`/admin/getByDateRange?startDate=${start}&endDate=${end}`)
    .then(response => response.json())
    .then(data => {
        if(data.get === true) {
            x = data.x;
            y = data.y;
            const message=`Orders From ${start} to ${end}` ;
            const label="Status"
            updateChart(x, y,message,label);
        } else {
            showAlert("Ooops!");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
function updateChart(xValues, yValues,message,label) {
  dataContainer.style.display='none';
    myChart.data.labels = xValues;
    myChart.data.datasets[0].data = yValues;
    myChart.options.title.text=message;
    myChart.options.scales.xAxes[0].scaleLabel.labelString = label;
    myChart.update();
}
function reset() {
  $('.dropdown-toggle').dropdown('toggle');
  dataContainer.style.display='block';
    myChart.data.labels = defaultX;
    myChart.data.datasets[0].data = defaultY;
    myChart.options.title.text="Orders By Payment Method";
    myChart.options.scales.xAxes[0].scaleLabel.labelString="Payment Method";
    myChart.update();
}
let xValues = x.split(',');
let yValues = y.split(',').map(Number);
let descriptions = disc;
const barColors = ["#00008b", "#000000", "brown", "#186F65", "purple"];


// Check the initial screen width
let initialChartType = window.innerWidth < 700 ? 'pie' : 'bar';

// Create the initial chart
let myChart = new Chart("myChart", {
    type: initialChartType,
    data: {
        labels: xValues,
        datasets: [{
            backgroundColor: barColors,
            data: yValues,
        }],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false
        },
        title: {
            display: true,
            text: "Orders By Payment Method",
            fontSize: 18,
            fontWeight: 'bold',
        },
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: "Payment Method",
                    fontSize: 16,
                    fontWeight: 'bold',
                },
                ticks: {
                    fontSize: 17,
                },
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: "Orders",
                    fontSize: 16,
                    fontWeight: 'bold',
                },
                ticks: {
                    fontSize: 17,
                    precision: 0,
                    suggestedMax: 10,
                    suggestedMin: 0,
                },
            }],
        },
        animation: {
            duration: 1500,
        },
    },
});

// Update the chart type on window resize
window.addEventListener('resize', function () {
    // Check the new screen width
    let newChartType = window.innerWidth < 700 ? 'pie' : 'bar';

    // Change the chart type if it's different from the initial type
    if (newChartType !== initialChartType) {
        myChart.destroy(); // Destroy the existing chart
        initialChartType = newChartType; // Update the initial chart type
        myChart = new Chart("myChart", {
            type: newChartType,
            data: myChart.config.data,
            options: myChart.config.options
        });
    }
});

document.querySelectorAll('.dropdown-item').forEach(function(item) {
  item.addEventListener('click', function(event) {
    var submenu = this.nextElementSibling;
    if (submenu.style.display === 'none') {
      submenu.style.display = 'block';
    } else {
      submenu.style.display = 'none';
    }
    event.stopPropagation();
  });
});