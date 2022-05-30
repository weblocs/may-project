/* -----------------------*/
/* --------GLOBAL--------*/
/* -----------------------*/
var isDebug = false;
var compareData = [];
var wishList = [];
var favOpenState = false;
var compareOpenState = false;
var compareBarOpenState = false;
var isCheckboxesInit = false;
var eventTriggered = 0;
var currentSeletedCar = {};

const onChangeElement = (qSelector, cb) => {
  let funcId = "onChangeElement_Observer";
  stopwatchStart(funcId);

  const targetNode = document.querySelector(qSelector);
  if (targetNode) {
    const config = {
      attributes: false,
      childList: true,
      subtree: false,
      characterData: true
    };
    const callback = function (mutationsList, observer) {
      cb($(qSelector));
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  } else {
    console.error("onChangeElement: Invalid Selector");
  }

  stopwatchEnd(funcId);
};

/* -----------------------*/
/* --------METHODS--------*/
/* -----------------------*/
function createTemplate() {
  let html = `
<div class="card-compare--header-wrapper">    
    <div class="card-compare--header">
        <div>Comparing</div>
        <a href="#" class="gc-collapse-btn gc-accordion-expanded">Collapse</a>
    </div>
    <div class="gc-accordion">
        <div class="card-compare-img">
            <div class="compare--img-box gc-clear">${drawCarHeader(
              compareData
            )}</div>
            <div class="compare--brand-model-span">
                <div class="compare--model-name"></div>
                <div class="compare--model-span"></div>
            </div>
        </div>
    </div>
</div>

<!-- Vehicle specs -->
${createCompareItem("Fuel type", drawCarFuel, compareData)}
${createCompareItem("Body style", drawCarBodyType, compareData)}
${createCompareItem("Drive type", drawCarDriveType, compareData)}
${createCompareItem("Seats", drawCarSeats, compareData)}

<!-- GreenCars score -->
<div class="card-compare-greenscore">
    <div class="compare--header green-border-botom">
        GreenCars score
    </div>
    <div class="compare--greenscore-content">
        <div class="compare--subtitle">
            <div>Overall rating</div>
        </div>
        <div class="greenscore--car-label gc-clear">${drawCarGreenScore(
          compareData
        )}</div>
        <div class="compare--greenscore-description gc-clear"></div>
    </div>
</div>

<div class="card-compare-performance">
    <div class="compare--header orange--border-bottom">
        Performance
    </div>

        <!-- Performance metrics -->
        ${createCompareItem("Total range", drawTotalRange, compareData)}
        ${createCompareItem("Electric range", drawElectricRange, compareData)}
        ${createCompareItem("Battery capacity", drawCarBatteryCap, compareData)}
        ${createCompareItem(
          "Time to charge 120v",
          drawCarChargeTime,
          compareData
        )}
        ${createCompareItem(
          "Time to charge 240v",
          drawCarChargeTime240,
          compareData
        )}
        ${createCompareItem("kWh per Mile", drawMilesKwh, compareData)}
        ${createCompareItem("MPG", drawCarMpg, compareData)}
        ${createCompareItem("Speed 0-60 mph", drawCarSpeed, compareData)}
        
        <div class="compare--item-header">
            <div>Performance score</div>
        </div>
        <div class="gc-clear">${drawCarPerformanceScore(compareData)}</div>
        <div class="card-details-row note">
        <div class="details-category-label">Charge times based on min. AC charging power; based on manufacturer and EPA estimates</div>

    </div>
    
</div>

<div class="card-compare-afford">
    <div class="compare--header yellow--border-bottom">
        Affordability
    </div>
        <!-- Affordability metrics -->
        ${createCompareItem("Starting MSRP", drawCarMsrp, compareData)}
        ${createCompareItem("Est. price", drawEstPrice, compareData)}
        ${createCompareItem("Est. payment*", drawEstPayment, compareData)}
        ${createCompareItem(
          "Incentives available",
          drawIncentives,
          compareData
        )}
        ${createCompareItem("Federal tax credits", drawFederalTax, compareData)}
        ${createCompareItem(
          "Energy cost per mile",
          drawCarEnergyCostMile,
          compareData
        )}
        ${createCompareItem(
          "Monthly fuel cost*",
          drawCarEnergyCost,
          compareData
        )}
        ${createCompareItem(
          "Total monthly cost*",
          drawTotalMonthlyCost,
          compareData
        )}
        ${createCompareItem(
          "Cost per mile of range*",
          drawCostRangeMile,
          compareData
        )}
        ${createCompareItem("kWh per Mile", drawMilesKwh, compareData)}

        <div class="compare--item-header">
            <div>Affordability score</div>
        </div>
        <div class="compare-affordscore--content">
            <div class="affordscore--label gc-clear">${drawCarAffordabilityScore(
              compareData
            )}</div>
            <div class="affordscore--value gc-clear"></div>
        </div>
        <div class="card-details-row note">
        <div class="details-category-label">50/50 mix of electricity vs gas for PHEVs, 15,000 miles driven annually; 60 monthly payments; 4% interest rate; 10% down payment; does not include incentive savings. Assumed energy costs are $0.11 kWh and $4.00/gallon of gasoline. Vehicle price estimates assume 10% annual depreciation based on original MSRP.
        </div>
    </div>
</div>

    <div class="card-compare-environ">
        <div class="compare--header lightgreen--border-bottom">
            Environmental impact
        </div>
        <div class="compare-environ--content">
            ${createCompareItem(
              "Annual CO2 emissions",
              drawCarCo2,
              compareData
            )}
            ${createCompareItem(
              "EPA smog rating",
              drawEpaSmogRating,
              compareData
            )}
            <div class="compare--item-header">
                <div>Environmental impact score</div>
            </div>
            <div class="compare-environscore--content">
                <div class="environscore--label gc-clear">${drawCarEnvironmentScore(
                  compareData
                )}</div>
                <div class="einvironscore--value gc-clear"></div>
            </div>
            <div class="card-details-row note">
            <div class="details-category-label">15,000 miles driven annually, based on EPA estimates. Plug-in hybrids assume 50/50 gas vs electric use.</div>
        </div>
        </div>
    </div>
`;

  $("#compare-box").empty();
  $("#compare-box").append(html);

  return html;
}

function createCompareItem(header, comparison, data) {
  return `<div class="card-compare-item">
    <div class="compare--item-header">
        ${header}
    </div>
    <div class="compare--item-content">
        <div class="compare--item-label gc-clear">${drawCarName(data)}</div>
        <div class="compare--item-description gc-clear">${comparison(
          data
        )}</div>
    </div>
</div>`;
}

function getCarName(e) {
  return `${$('[fs-cmsfilter-field="year"]', e).html()} ${$(
    '[fs-cmsfilter-field="brand"]',
    e
  ).html()} / ${$(".cars-tab-vehicle--model-span", e).html()}`;
}

function drawCarName(data) {
  let html = "";
  data.map((e) => {
    html += `<div>${e.name}</div>`;
  });
  return html;
}

function drawCarHeader(data) {
  let html = "";
  data.map((e) => {
    html += `<div class="car-name-wrapper">
                <div class="car-image-labels">
                    <div class=""><img src="${
                      e.image
                    }" loading="lazy" alt="" class="car-image"> 
                    </div>
                    <div class="car-name-labels">
                        <div class="car-label-content">${e.name}</div>
                        <div class="car-span-content">${e.model}</div>
                    </div>
                </div>
                <img gc-id="${e.id}" onclick="maintainWishList(${
      e.id
    })" class="new-fav-image" src="${favImageState(e.id)}">
            </div>`;
  });
  return html;
}

function drawCarFuel(data) {
  let html = "";

  data.map((e) => {
    let fuel = e.fuelType;
    let icon = () => {
      if (fuel === "Plug-in Hybrid") {
        return "https://assets-global.website-files.com/6238640c74e61b4d447f965f/6239ecfe02679538217e7b8c_plugin.svg";
      } else if (fuel === "Battery Electric") {
        return "https://assets-global.website-files.com/6238640c74e61b4d447f965f/6238ffb8822246636b7dfab9_electric.svg";
      } else {
        return "https://assets-global.website-files.com/6238640c74e61b4d447f965f/624c8c83dbb778511f4e433d_GreenCars_Icons_Categories_simplified_hybrid.svg";
      }
    };
    html += `<div class="cars-tab-single-tab-flex-container">
                    <img src="${icon()}" loading="lazy" alt="" class="plugin-icon">
                    <div class="cars-tab-type--label">${fuel}</div>
                </div>`;
  });
  return html;
}

function drawCarSeats(data) {
  let html = "";
  data.map((e) => {
    html += `<div class="value">${e.seats}</div>`;
  });
  return html;
}

function drawEstPrice(data) {
  let html = "";
  data.map((e) => {
    html += `<div class="value">${formatter.format(e.estPrice)}</div>`;
  });
  return html;
}

function drawIncentives(data) {
  let html = "";
  data.map((e) => {
    html += `<div class="value"><a href="https://tools.greencars.com/incentives" target="_blank" class="details-category-link">View</a></div>`;
  });
  return html;
}

function drawFederalTax(data) {
  let html = "";
  data.map((e) => {
    html += `<div class="value"><a href="${e.federalUrl}" target="_blank" class="details-category-link">Yes</a></div>`;
  });
  return html;
}

function drawEstPayment(data) {
  let html = "";
  data.map((e) => {
    html += `<div class="value">${formatter.format(e.estPayment)} /mo</div>`;
  });
  return html;
}

function drawCarMpg(data) {
  let html = "";
  data.map((e) => {
    html += `<div class="value">${e.mpg}</div>`;
  });
  return html;
}

function drawElectricRange(data) {
  let html = "";
  data.map((e) => {
    html += `<div class="value">${e.electricRange} miles</div>`;
  });
  return html;
}

function drawCarDriveType(data) {
  let html = "";
  data.map((e) => {
    if (!e.driveType) {
      html += `<div class="value">n/a</div>`;
    }
    html += `<div class="value">${e.driveType}</div>`;
  });
  return html;
}

function drawCarBodyType(data) {
  let html = "";
  data.map((e) => {
    html += `<div class="value">${e.bodyType}</div>`;
  });
  return html;
}

function drawCarGreenScore(data) {
  let html = "";
  data.map((e) => {
    html += `<div class="green-score-label-box">
                    <div class="gs-label">${e.name}</div>
                    <div class="value-special">${e.greenScore} out of 5</div>
                </div>`;
  });
  return html;
}

function drawTotalRange(data) {
  let html = "";
  data.map((e) => {
    html += `<div class="value">${e.totalRange} miles</div>`;
  });
  return html;
}

function drawCarSpeed(data) {
  let html = "";
  data.map((e) => {
    if (e.speed == 0.0) {
      return (html += `<div class="value">n/a</div>`);
    }

    html += `<div class="value">${e.speed} seconds</div>`;
  });
  return html;
}

function drawCarBatteryCap(data) {
  let html = "";
  data.map((e) => {
    html += `<div class="value">${e.batteryCap} kWh</div>`;
  });
  return html;
}

function drawCarChargeTime(data) {
  let html = "";
  data.map((e) => {
    html += `<div class="value">${e.chargeTime} hrs</div>`;
  });
  return html;
}

function drawCarChargeTime240(data) {
  let html = "";
  data.map((e) => {
    html += `<div class="value">${e.chargeTime240} hrs</div>`;
  });
  return html;
}

function drawMilesKwh(data) {
  let html = "";
  data.map((e) => {
    html += `<div class="value">${e.milesKwh}</div>`;
  });
  return html;
}

function drawCarPerformanceScore(data) {
  let html = "";
  data.map((e) => {
    html += `  <div class="performance-score-label-box">
                    <div class="perf-label">${e.name}</div>
                    <div class="value-special">${e.performanceScore} out of 5</div>
                </div>`;
  });
  return html;
}

function drawCarMsrp(data) {
  let html = "";
  data.map((e) => {
    html += `<div class="value">${formatter.format(e.baseMsrp)}</div>`;
  });
  return html;
}

function drawCarEnergyCost(data) {
  let html = "";
  data.map((e) => {
    html += `<div class="value">${formatter.format(e.energyCost)}</div>`;
  });
  return html;
}

function drawCostRangeMile(data) {
  let html = "";
  data.map((e) => {
    html += `<div class="value">${formatter.format(e.costRangeMile)}/mo</div>`;
  });
  return html;
}

function drawTotalMonthlyCost(data) {
  let html = "";
  data.map((e) => {
    html += `<div class="value">${formatter.format(e.totalMonthlyCost)}</div>`;
  });
  return html;
}

function drawCarEnergyCostMile(data) {
  let html = "";
  data.map((e) => {
    html += `<div class="value">${formatter.format(
      e.energyCostMile
    )} per mile</div>`;
  });
  return html;
}

function drawCarAffordabilityScore(data) {
  let html = "";
  data.map((e) => {
    html += `  <div class="affordability-score-label-box">
                    <div class="perf-label">${e.name}</div>
                    <div class="value-special">${e.affordabilityScore} out of 5</div>
                </div>`;
  });
  return html;
}

function drawCarCo2(data) {
  let html = "";
  data.map((e) => {
    if (e.co2 == 0) {
      return (html += `<div class="value">n/a</div>`);
    }
    html += `<div class="value">${e.co2}</div>`;
  });
  return html;
}

function drawEpaSmogRating(data) {
  let html = "";
  data.map((e) => {
    if (e.epaSmogRating == 0) {
      return (html += `<div class="value">n/a</div>`);
    }
    html += `<div class="value">${e.epaSmogRating}</div>`;
  });
  return html;
}

function drawCarEnvironmentScore(data) {
  let html = "";
  data.map((e) => {
    html += `<div class="environ-score-label-box">
                    <div class="envi-label">${e.name}</div>
                    <div class="value-special">${e.environmentScore} out of 5</div>
                </div>`;
  });
  return html;
}

function drawFavItem(e) {
  let arr = [];
  arr.push(e);
  let html = `
    <div class="gc-fav-card">
    <div gc-fav-details-id="${
      e.id
    }" style="width 300ms ease 0s, opacity 300ms ease 0s; display: none; width: 0px; opacity: 0; z-index:0;" class="car-card-details">
        <img src="https://assets-global.website-files.com/6238640c74e61b4d447f965f/623df494e26152e5c82c2224_Vector.svg" loading="lazy" alt="" class="card-details--close-icon" onclick="closeFavCarDetails(${
          e.id
        })">
        <div class="card-details--header single-view">
            ${drawCarHeader(arr)}
        </div>
        <div class="center-all">
            <div class="card-details-section">
                <div class="card-details-header">
                    <div>Vehicle Specs</div>
                </div>
                ${drawCarDetailRow({ label: "Type", value: drawCarFuel(arr) })}
                ${drawCarDetailRow({ label: "Body style", value: e.bodyType })}
                ${drawCarDetailRow({ label: "Drive type", value: e.driveType })}
                ${drawCarDetailRow({
                  label: "Number of seats",
                  value: e.seats
                })}
            </div>

            <div class="card-details-greenscore-section">
                <div class="greenscore-section-header">
                    <div>GreenCars Score</div>
                </div>
                ${drawGreenScoreBox(e.greenScore)}
            </div>

            <div class="card-details-section">
                <div class="card-details-header orange">
                    <div>Performance</div>
                </div>
                ${drawCarDetailRow({
                  label: "Total range",
                  value: `${e.totalRange} miles`
                })}
                ${drawCarDetailRow({
                  label: "Electric range",
                  value: `${e.electricRange} miles`,
                  type: "alternate"
                })}
                ${drawCarDetailRow({
                  label: "Battery capacity",
                  value: `${e.batteryCap} kWh`
                })}
                ${drawCarDetailRow({
                  label: "Time to charge 120V",
                  value: `${e.chargeTime} hrs`,
                  type: "alternate"
                })}
                ${drawCarDetailRow({
                  label: "Time to charge 240V",
                  value: `${e.chargeTime240} hrs`
                })}
                ${drawCarDetailRow({
                  label: "kWh/mile",
                  value: e.milesKwh,
                  type: "alternate"
                })}
                ${drawCarDetailRow({ label: "MPG", value: e.mpg })}
                ${drawCarDetailRow({
                  label: "Speed 0 - 60 mph",
                  value: `${e.speed}s`,
                  type: "alternate"
                })}
                <div class="card-details-row note">
                    <div class="details-category-label">Charge times based on min. AC charging power; based on manufacturer and EPA estimates</div>
                </div>
                <div class="performance-summary orange">
                    <div class="details-category-label">Performance score</div>
                    <div class="details-category-value">${
                      e.performanceScore
                    } out of 5</div>
                </div>
            </div>

            <div class="card-details-section">
                <div class="card-details-header yellow">
                    <div>Affordability</div>
                </div>
                ${drawCarDetailRow({
                  label: "Starting MSRP",
                  value: `${formatter.format(e.baseMsrp)}`
                })}
                ${drawCarDetailRow({
                  label: "Est. price",
                  value: `${formatter.format(e.estPrice)}`,
                  type: "alternate"
                })}
                ${drawCarDetailRow({
                  label: "Est. payment*",
                  value: `${formatter.format(e.estPayment)}/mo`
                })}
                ${drawCarDetailRow({
                  label: "Incentives available",
                  value: `<a href="https://tools.greencars.com/incentives" target="_blank" class="details-category-link">View</a>`,
                  type: "alternate"
                })}
                ${drawCarDetailRow({
                  label: "Federal tax credits",
                  value: `<a href="${e.federalUrl}" target="_blank" class="details-category-link">Yes</a>`
                })}
                ${drawCarDetailRow({
                  label: "Energy cost per mile*",
                  value: `$${e.energyCostMile}`,
                  type: "alternate"
                })}
                ${drawCarDetailRow({
                  label: "Monthly fuel cost*",
                  value: `${formatter.format(e.energyCost)}`
                })}
                ${drawCarDetailRow({
                  label: "Total monthly cost*",
                  value: `${formatter.format(e.totalMonthlyCost)}`,
                  type: "alternate"
                })}
                ${drawCarDetailRow({
                  label: "Cost per mile of range*",
                  value: `$${e.costRangeMile}/mo`
                })}
                <div class="card-details-row note">
                    <div class="details-category-label">50/50 mix of electricity vs gas for PHEVs, 15,000 miles driven annually; 60 monthly payments; 4% interest rate; 10% down payment; does not include incentive savings. Assumed energy costs are $0.11 kWh and $4.00/gallon of gasoline. Vehicle price estimates assume 10% annual depreciation based on original MSRP.
                    </div>
                </div>
                <div class="affordability-summary yellow">
                    <div class="details-category-label">Affordability score</div>
                    <div class="details-category-value">${
                      e.affordabilityScore
                    } out of 5</div>
                </div>
            </div>

            <div class="card-details-section">
                <div class="card-details-header green">
                    <div>Environmental Impact</div>
                </div>
                ${drawCarDetailRow({
                  label: "Annual CO2 emissions",
                  value: `${e.co2} tons`
                })}
                ${drawCarDetailRow({
                  label: "EPA smog rating",
                  value: `${e.epaSmogRating}`,
                  type: "alternate"
                })}
                <div class="card-details-row note">
                    <div class="details-category-label">15,000 miles driven annually, based on EPA estimates. Plug-in hybrids assume 50/50 gas vs electric use.</div>
                </div>
                <div class="environmental-summary green">
                    <div class="details-category-label">Environment score</div>
                    <div class="details-category-value">${
                      e.environmentScore
                    } out of 5</div>
                </div>
            </div>
        </div>

        <div class="car-details-button-wrapper gc-block">
        ${determineUrl("green")}
        </div>
    </div>


    <div class="gc-fav-card-top"><label class="w-checkbox gc-fav-checkbox-field">
            <div class="w-checkbox-input w-checkbox-input--inputType-custom checkbox gc-checkbox ${isInCompare(
              e.id
            )}">
            </div>
            <input onclick="maintainWishListCompare(${
              e.id
            })" type="checkbox" name="" data-name="" style="opacity:0;position:absolute;z-index:-1"><span class="checkbox-label w-form-label">Checkbox</span>
        </label>
        <div class="gc-fav-type-wrapper">
            <div class="cars-tab-type--label">${drawCarFuel(arr)}</div>
        </div>
        <div onclick="openFavCarDetails(${
          e.id
        })" class="gc-fav-inner-content"><img src="${
    e.image
  }" loading="lazy" alt="" class="gc-fav-image">
            <div class="gc-fav-name-wrapper">
                <div class="cars-tab-single-tab-flex-container">
                    <div class="cars-tab-vehicle--model-name">${e.name}</div>
                </div>
                <div class="gc-fav-model-name">${e.model}</div>
            </div>
            <div class="gc-fav-price-wrapper">
                <div class="gc-fav-label">Est. price</div>
                <div class="gc-fav-flex">
                    <div fs-cmssort-field="price">${formatter.format(
                      e.estPrice
                    )}</div>
                </div>
            </div>
        </div>
    </div>

    <div class="gc-fav-card-bot"><a data-w-id="21f5af52-1db9-3f8d-9578-5b9dac6f6c54" href="#" class="gc-fav-remove outer w-inline-block">
            <div>Remove</div>
        </a>
        ${determineUrl()}
        <div class="gc-remove-confirmation">
            <h3>Sure you want to remove this from your favorites?</h3><a onclick="maintainWishList(${
              e.id
            })" href="#" class="gc-fav-btn-new w-inline-block">
                <div>Yes, remove</div>
            </a>
            <div class="gc-fav-btn-wrapper"><a data-w-id="62a36c55-3cbc-0699-6e12-1eec9ec782f9" href="#" class="gc-fav-remove inner w-inline-block">
                    <div>No, I want to keep it</div>
                </a></div>
        </div>
    </div>

</div>
`;

  function isInCompare(id) {
    let foundCompare = compareData.find((x) => {
      return x.id == id;
    });

    if (foundCompare) {
      return "w--redirected-checked";
    }
  }

  function determineUrl(type) {
    let url = "";
    let label = "";
    let icon =
      type != "green"
        ? "https://assets-global.website-files.com/6238640c74e61b4d447f965f/625b6e90d5da03ed9cf4f2d3_right%20icon%20-%20small.svg"
        : "https://assets-global.website-files.com/6238640c74e61b4d447f965f/623e3545aa6e8ebc198ae0a4_right%20icon%20-%20small.svg";
    type =
      type == "green" ? "car-details-driveway-button" : "gc-fav-driveway-btn";
    if (e.preOrderUrl != "") {
      url = e.preOrderUrl;
      label = "Pre-order";
    } else {
      url = e.shopDriveway;
      label = "Shop on Driveway";
    }

    return `
        <a href="${url}" class="${type} w-inline-block">
            <div>${label}</div>
            <img loading="lazy" src="${icon}" alt="" class="external-icon green">
        </a>`;
  }

  return html;
}

function drawCarDetailRow(args) {
  let html = "";
  let defaults = { label: "", value: "n/a", type: "" };

  let props = {
    ...defaults,
    ...args
  };

  return (html = `<div class="card-details-row ${props.type}">
            <div class="details-category-label">${
              props.label === "" ? "n/a" : props.label
            }</div>
            <div class="details-category-value">${
              props.value === "" ? "n/a" : props.value
            }</div>
        </div>`);
}

function drawGreenScoreBox(score) {
  let html = "";
  let green = `<img class="big-leaf" src="https://assets-global.website-files.com/6238640c74e61b4d447f965f/623b23057582ddb7fd18e23e_leaf-green.svg" loading="lazy" alt="">`;
  let grey = `<img class="big-leaf" src="https://assets-global.website-files.com/6238640c74e61b4d447f965f/623b22eeb0db51ba54f37df2_leaf-grey.svg" loading="lazy" alt="">`;
  let half = `<img class="big-leaf" src="https://uploads-ssl.webflow.com/6238640c74e61b4d447f965f/6267b13a96f71371ec3d186d_leaf-half.svg" loading="lazy" alt="">`;
  let s = parseFloat(score);
  let leafs = "";

  if (s === 5) {
    leafs = `${green}${green}${green}${green}${green}`;
  } else if (s >= 4.01 && s <= 4.99) {
    leafs = `${green}${green}${green}${green}${half}`;
  } else if (s === 4) {
    leafs = `${green}${green}${green}${green}${grey}`;
  } else if (s >= 3.01 && s <= 3.99) {
    leafs = `${green}${green}${green}${half}${grey}`;
  } else if (s === 3) {
    leafs = `${green}${green}${green}${grey}${grey}`;
  } else if (s >= 2.01 && s <= 2.99) {
    leafs = `${green}${green}${half}${grey}${grey}`;
  } else if (s === 2) {
    leafs = `${green}${green}${grey}${grey}${grey}`;
  } else if (s >= 1.01 && s <= 1.99) {
    leafs = `${green}${half}${grey}${grey}${grey}`;
  } else if (s === 1) {
    leafs = `${green}${grey}${grey}${grey}${grey}`;
  } else if (s >= 0.01 && s <= 0.99) {
    leafs = `${half}${grey}${grey}${grey}${grey}`;
  } else if (s === 0) {
    leafs = `${grey}${grey}${grey}${grey}${grey}`;
  } else {
    html = `n/a`;
    return html;
  }

  return (html = `<div class="greenscore-score-box">
                        <div class="score-box-icons-wrapper">${leafs}</div>
                        <div class="score-box-value"><div>${score} out of 5</div></div>
                    </div>`);
}

function drawGreenScoreLeafs(score) {
  let html = "";
  let green = `<img class="small-leaf" src="https://assets-global.website-files.com/6238640c74e61b4d447f965f/623b23057582ddb7fd18e23e_leaf-green.svg" loading="lazy" alt="">`;
  let grey = `<img class="small-leaf" src="https://assets-global.website-files.com/6238640c74e61b4d447f965f/623b22eeb0db51ba54f37df2_leaf-grey.svg" loading="lazy" alt="">`;
  let half = `<img class="small-leaf" src="https://uploads-ssl.webflow.com/6238640c74e61b4d447f965f/6267b13a96f71371ec3d186d_leaf-half.svg" loading="lazy" alt="">`;
  let s = parseFloat(score);
  let leafs = "";

  if (s === 5) {
    leafs = `${green}${green}${green}${green}${green}`;
  } else if (s >= 4.01 && s <= 4.99) {
    leafs = `${green}${green}${green}${green}${half}`;
  } else if (s === 4) {
    leafs = `${green}${green}${green}${green}${grey}`;
  } else if (s >= 3.01 && s <= 3.99) {
    leafs = `${green}${green}${green}${half}${grey}`;
  } else if (s === 3) {
    leafs = `${green}${green}${green}${grey}${grey}`;
  } else if (s >= 2.01 && s <= 2.99) {
    leafs = `${green}${green}${half}${grey}${grey}`;
  } else if (s === 2) {
    leafs = `${green}${green}${grey}${grey}${grey}`;
  } else if (s >= 1.01 && s <= 1.99) {
    leafs = `${green}${half}${grey}${grey}${grey}`;
  } else if (s === 1) {
    leafs = `${green}${grey}${grey}${grey}${grey}`;
  } else if (s >= 0.01 && s <= 0.99) {
    leafs = `${half}${grey}${grey}${grey}${grey}`;
  } else if (s === 0) {
    leafs = `${grey}${grey}${grey}${grey}${grey}`;
  } else {
    html = `n/a`;
    return html;
  }

  return (html = `<div class="score-box-icons-wrapper less-padding">${leafs}</div>`);
}

/* -----------------------*/
/* -----MANAGE STATE----*/
/* -----------------------*/
function checkFilterState(i) {
  setTimeout(function () {
    let length = $("#filter-active").children(
      '[fs-cmsfilter-element="tag-template"]'
    ).length;
    if (i === 1) {
      length = 0;
    }
    $("#active-filter-label").text(`${length} Filters`);
    if (length < 1) {
      $("#filter-active, #filters-action").css("display", "none");
    } else {
      $("#filter-active, #filters-action").css("display", "flex");
    }
  }, 300);
}

function favImageState(id) {
  let wishListCookie = localStorage.getItem("wishListCookie");
  let wishListData = wishListCookie;
  if (wishListData.indexOf(id) != -1) {
    return "https://uploads-ssl.webflow.com/6238640c74e61b4d447f965f/624ed35c7d78d72367447989_State%3Dselected.svg";
  } else
    return "https://uploads-ssl.webflow.com/6238640c74e61b4d447f965f/624ed35c17266b5ec5f27bb8_State%3Ddefault.svg";
}

function getCarDetailState(e) {
  return $(e).attr("gc-state");
}

function setCarDetailState(e) {
  let state = getCarDetailState(e);

  if (state === "false") {
    state = "true";
  } else {
    state = "false";
  }

  $(e).attr("gc-state", state);
  return;
}

function isMobileWidth(f) {
  console.log("Mobile width checked");
  let state = $("#mobile-indicator").is(":visible");
  return state ? true : f();
}

function clearCompare() {
  compareData = [];
  initCompareBar();
  $(".gc-checkbox").removeClass("w--redirected-checked");
  localStorage.setItem("compareDataCookie", JSON.stringify(compareData));
}

function updateCompareLabel() {
  $(".comparing-bar-value-label").text(
    `Comparing ${compareData.length} ${
      compareData.length === 1 ? "Vehicle" : "Vehicles"
    }`
  );
}
/* -----------------------*/
/* -----SWITCHES----*/
/* -----------------------*/
function openFavCarDetails(id) {
  closeFavCarDetails();
  $(".comparing-bar").css("z-index", "0");
  let el = $('[gc-fav-details-id="' + id + '"]');
  el.css("z-index", "1").css("top", "6%");
  el.css("display", "flex");
  //$('.car-details-button-wrapper').show().css("z-index", "1");
  tram(el).start({
    width: "",
    opacity: 1
  });
}

function closeFavCarDetails() {
  closeCompare();
  $(".comparing-bar").css("z-index", "10");
  let el = $("[gc-fav-details-id]");
  tram(el).start({
    width: "0",
    opacity: 0
  });
  //$('.car-details-button-wrapper').hide();
  el.hide();
  el.css("top", "0%");
}

function openCarDetails(e) {
  closeAll();
  currentSeletedCar = {};
  if (!isCheckboxesInit) {
    initCheckboxBinding();
  }

  // block scope
  let el = $(e).siblings($(".car-card-details"));
  let id = $(e).find('[fs-cmsfilter-field="vehicle-id"]').html();
  let score = $(e).find('[fs-cmsfilter-field="new-green-score"]').html();
  let lineItem = $(el).closest($(".cars-database-collection-item")).html();

  //draw greenbox score
  $('[gc-greenbox="' + id + '"]').empty();
  $('[gc-fav-mount-id="' + id + '"]').empty();
  $('[gc-greenbox="' + id + '"]').append(drawGreenScoreBox(score));

  // build fav on car details
  $('[gc-fav-mount-id="' + id + '"]').append(
    `<img gc-id="${id}" onclick="maintainWishList(null)" class="new-fav-image" src="${favImageState(
      id
    )}">`
  );

  //make visual changes to ui
  el.css("display", "flex");
  tram(el).start({
    display: "flex",
    width: "",
    opacity: 1
  });
  //$('.car-details-button-wrapper').show();

  //handle global state
  setCarDetailState(e);
  currentSeletedCar = constructDataObj(id, lineItem);
}

function closeCarDetails() {
  //block scope
  let el = $('[gc-state="true"]').siblings($(".car-card-details"));

  //make visual changes to ui
  //$('.car-details-button-wrapper').hide();
  tram(el).start({
    width: 0,
    opacity: 0
  });
  $('[gc-state="true"]').attr("gc-state", "false");
}

function openFav() {
  closeCarDetails();
  if (favOpenState === true) {
    $("#favorite-section").hide();
    $(".view-favorites-label").text(`View Favorites (${wishList.length})`);
    favOpenState = false;
  } else {
    $("#favorite-section").show();
    $(".view-favorites-label").text(`View Buyer's Guide`);
    favOpenState = true;
  }
}

function openCompare() {
  closeCarDetails();
  compareOpenState = true;
  $(".car-details-button-wrapper-gc-block").show();
  let el = $(".car-card-compare");
  if (compareData.length >= 1) {
    el.css("display", "flex");
    tram(el).start({
      width: "",
      opacity: 1
    });
  } else {
    closeCompare();
  }

  closeCompareBar();
}

function closeCompare() {
  compareOpenState = false;

  let el = $(".car-card-compare");
  tram(el).start({
    width: 0,
    opacity: 0
  });
  $(".car-details-button-wrapper-gc-block").hide();
  compareData.length <= 0 ? closeCompareBar() : openCompareBar();
}

function closeAll() {
  currentSeletedCar = {};
  closeCarDetails();
  closeCompare();
  closeFavCarDetails();
}

function collapseDetails() {
  $(".gc-accordion").addClass("gc-collapse");
  $(".gc-collapse-btn").text("Expand");
  $(".gc-collapse-btn").removeClass("gc-accordion-expanded");
}

function expandDetails() {
  $(".gc-accordion").removeClass("gc-collapse");
  $(".gc-collapse-btn").text("Collapse");
  $(".gc-collapse-btn").addClass("gc-accordion-expanded");
}

function singleTriggerAccordion(e) {
  let el = $(e).siblings($(".gc-accordion"));
  return el.hasClass("gc-collapse")
    ? el.removeClass("gc-collapse")
    : el.addClass("gc-collapse");
}

function handelFilterResults() {
  let results = $('[fs-cmsfilter-element="results-count"]').text();
  $("#results-mobile").text(results);
}

function openCompareBar() {
  if (compareData <= 0) {
    closeCompareBar();
    return;
  }
  let bar = $("#comparing-bar");
  bar.show();
  tram(bar).start({
    height: "",
    opacity: 1
  });
}

function closeCompareBar() {
  let bar = $("#comparing-bar");
  tram(bar).start({
    height: "0",
    opacity: 0
  });
  bar.hide();
}
/* -----------------------*/
/* -----INIT METHODS----*/
/* -----------------------*/
function initCheckboxes() {
  let funcId = "initCheckboxes";
  stopwatchStart(funcId);

  if (compareData.length > 0) {
    for (let item of compareData) {
      $('[gc-check-id="' + item.id + '"]')
        .siblings($(".gc-checkbox"))
        .addClass("w--redirected-checked");
    }
  }

  stopwatchEnd(funcId);
}

function initCheckboxBinding(id) {
  let funcId = "initCheckboxBinding";
  stopwatchStart(funcId);

  let lineItem = $('[gc-check-id="' + id + '"]')
    .closest($(".cars-database-collection-item"))
    .html();

  let flag = compareData.find((x) => {
    return x.id === id;
  });

  if (!flag) {
    id == null
      ? (compareData = [])
      : compareData.push(constructDataObj(id, lineItem));
  }

  if (flag) {
    compareData = compareData.filter((el) => {
      return el.id != id;
    });
  }

  if (compareData.length <= 0) {
    return;
  }
  createTemplate();
  initCompareBar();
  updateCompareLabel();
  //isMobileWidth(openCompare);
  initCompareHeaderAccordion();
  initCompareCollapseAll();

  localStorage.setItem("compareDataCookie", JSON.stringify(compareData));

  isCheckboxesInit = true;

  stopwatchEnd(funcId);
}

function initTram() {
  tram($(".car-card-details"))
    .add("opacity 300ms ease")
    .add("width 300ms ease")
    .set({
      width: 0,
      opacity: 0
    });
}

function initCarSingleTab() {
  $(".cars-tab-single-tab").off("click");
  $(".cars-tab-single-tab").on("click", function (event) {
    if (
      $(event.target).is("input") ||
      $(event.target).hasClass("w-checkbox-input")
    ) {
      return;
    }

    let el = $(event.target).closest($(".cars-tab-single-tab"));

    let state = getCarDetailState(el);
    if (state === "true") {
      closeAll();
    } else {
      openCarDetails(el);
    }
  });
}

function initCompareBar() {
  if (compareOpenState === true) {
    closeCompareBar();
    return;
  }

  if (compareData.length > 0) {
    //isMobileWidth(openCompare);
    compareData.length == 1
      ? $("#compare-button").prop("disabled", true)
      : $("#compare-button").prop("disabled", false);
    openCompareBar();
    createTemplate();
  } else {
    closeCompareBar();
  }
}

function initCompareHeaderAccordion() {
  $(".compare--header").off();
  $(".compare--header").on("click", function (event) {
    let el = $(event.target);
    singleTriggerAccordion(el);
  });
}

function initCompareCollapseAll() {
  $(".gc-collapse-btn").off();
  $(".gc-collapse-btn").on("click", function () {
    $(this).hasClass("gc-accordion-expanded")
      ? collapseDetails()
      : expandDetails();
  });
}

function initViewFav() {
  $('.view-favorites-wrapper, [gc-event="openFav"]').off();
  $('.view-favorites-wrapper, [gc-event="openFav"]').on("click", function () {
    closeAll();
    openFav();
  });
}

function initCloseOutside() {
  $(
    "body, .filters-wrapper, .section-header, .w-nav, .w-container, .w-pagination-wrapper, .wf-section, .active-filters-actions, .active-filters-wrapper, .gc-fav-list"
  ).off();
  $(
    "body, .filters-wrapper, .section-header, .w-nav, .w-container, .w-pagination-wrapper, .wf-section, .active-filters-actions, .active-filters-wrapper, .gc-fav-list"
  ).on("click", function (event) {
    if (event.target !== this) {
      return;
    }
    closeAll();
  });
}

function initCloseDetails() {
  $('[gc-event="closeCarDetails"]').off();
  $('[gc-event="closeCarDetails"]').on("click", function () {
    closeCarDetails();
  });
}

function initGreenCars() {
  mountWishList();
  checkFilterState(1);
  initViewFav();
  initTram();
  initCompareBar();

  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    "cmsfilter",
    (filterInstances) => {
      // The callback passes a `filterInstances` array with all the `CMSFilters` instances on the page.
      const [filterInstance] = filterInstances;

      // The `renderitems` event runs whenever the list renders items after filtering.
      filterInstance.listInstance.on("renderitems", (renderedItems) => {
        stopwatchStart("observer_fnsweet_render");
        checkFilterState();
        initCheckboxes();
        initCarSingleTab();
        initViewFav();
        initCloseOutside();
        initCloseDetails();
        handelFilterResults();
        updateCompareLabel();
        $('[gc-event="format"]').each((i, e) => reFormat($(e)));
        $('[gc-event="drawLeafs"]').each((i, e) => replaceGcScore($(e)));
        stopwatchEnd("observer_fnsweet_render");
      });
    }
  ]);
}
/* -----------------------*/
/* -----WISHLIST----*/
/* -----------------------*/

function maintainWishList(id) {
  let funcId = "maintainWishList";
  stopwatchStart(funcId);

  let fromCarDetails = false;

  if (!id) {
    id = currentSeletedCar.id;
    fromCarDetails = true;
  }

  let flag = wishList.find((x) => {
    return x.id == id;
  });

  if (!flag) {
    if (!fromCarDetails) {
      let result = compareData.filter((el) => {
        return el.id == id;
      });
      wishList.push(result[0]);
    } else {
      wishList.push(currentSeletedCar);
    }
  }

  $('[gc-id="' + id + '"]').attr(
    "src",
    "https://uploads-ssl.webflow.com/6238640c74e61b4d447f965f/624ed35c7d78d72367447989_State%3Dselected.svg"
  );

  if (flag) {
    wishList = wishList.filter((el) => {
      return el.id != id;
    });

    $('[gc-id="' + id + '"]').attr(
      "src",
      "https://uploads-ssl.webflow.com/6238640c74e61b4d447f965f/624ed35c17266b5ec5f27bb8_State%3Ddefault.svg"
    );
  }

  localStorage.setItem("wishListCookie", JSON.stringify(wishList));
  mountWishList();

  stopwatchEnd(funcId);
}

function mountWishList() {
  let funcId = "mountWishList";
  stopwatchStart(funcId);

  let html = "";
  let saved = function () {
    if ($(".saved-label").length != 0) {
      $(".saved-label").text(`Saved vehicles: ${wishList.length}`);
      return ``;
    } else {
      return `<div class="saved-label">Saved vehicles: ${wishList.length}</div>`;
    }
  };
  $("#favorites-wrapper").empty();
  if (wishList.length) {
    $("#fav-isempty").hide();
    for (let item of wishList) {
      html += `<div gc-fav-id="${item.id}">${drawFavItem(item)}</div>`;
    }
    $("#favorites-wrapper").append(html).before(saved());
  } else {
    $(".saved-label").empty();
    $("#fav-isempty").show();
  }

  if (favOpenState === true) {
    $(".view-favorites-label").text(`View Buyer's Guide`);
  } else {
    $(".view-favorites-label").text(`View Favorites (${wishList.length})`);
  }

  Webflow.destroy();
  Webflow.ready();
  Webflow.require("ix2").init();
  stopwatchEnd(funcId);
}

function maintainWishListCompare(id) {
  let funcId = "maintainWishListCompare";
  stopwatchStart(funcId);

  let foundCompare = compareData.find((x) => {
    return x.id == id;
  });

  let foundWishlist = wishList.find((x) => {
    return x.id == id;
  });

  if (!foundCompare) {
    let result = wishList.filter((el) => {
      return el.id == id;
    });
    compareData.push(result[0]);
  }

  if (foundCompare) {
    compareData = compareData.filter((el) => {
      return el.id != id;
    });
  }

  initCompareBar();
  updateCompareLabel();
  closeFavCarDetails();
  createTemplate();
  initCompareHeaderAccordion();
  initCompareCollapseAll();

  localStorage.setItem("compareDataCookie", JSON.stringify(compareData));

  stopwatchEnd(funcId);
}

/* -----------------------*/
/* --MAIN EVENT HANDLERS--*/
/* -----------------------*/
$(document).ready(function () {
  let funcId = "DocumentReady";
  stopwatchStart(funcId);
  let viewport_meta = $('meta[name="viewport"]');
  const viewports = {
    default: viewport_meta.attr("content"),
    tablet: "width=978"
  };
  const viewport_set = () => {
    // console.log('viewport_set');
    if ($(window).width() < 1320 && $(window).width() > 990) {
      viewport_meta.attr("content", viewports.tablet);
      // console.log('Viewport is in true');
    } else {
      viewport_meta.attr("content", viewports.default);
      // console.log('Viewport is in false');
    }
  };

  /* ----------------------------*/
  /* -----BLOCK SCOPE VAR--------*/
  /* ----------------------------*/
  let compareDataCookie = localStorage.getItem("compareDataCookie");
  let wishListCookie = localStorage.getItem("wishListCookie");

  /* ----------------------------*/
  /* POPULATE CONTENT FROM COOKIE*/
  /* ----------------------------*/
  if (!wishListCookie) {
    localStorage.setItem("wishListCookie", "");
  } else {
    wishList = JSON.parse(wishListCookie);
  }

  if (!compareDataCookie) {
    localStorage.setItem("compareDataCookie", "");
  } else {
    compareData = JSON.parse(compareDataCookie);
  }

  /* -----------------------*/
  /* -----CALL INIT METHODS----*/
  /* -----------------------*/
  initGreenCars();
  //viewport_set();

  /* -----------------------*/
  /* -----EVENT HANDLERS----*/
  /* -----------------------*/

  $(".gc-close-dropdown").on("click", function () {
    $(this).closest($(".w-dropdown")).trigger("w-close");
    $("#comparing-bar").css("z-index", "10");
    //initCompareBar();
  });

  $("#gc-mobile-filter").on("click", function () {
    $("#comparing-bar").css("z-index", "0");
  });

  $("#compare-button").on("click", function () {
    closeCarDetails();
    initCompareHeaderAccordion();
    initCompareCollapseAll();
    openCompare();
  });

  $('[gc-event="closeCompare"]').on("click", function () {
    closeCompare();
  });

  $('[gc-event="clearCompare"]').on("click", function () {
    clearCompare();
  });

  $(window).resize(function () {
    // viewport_set();
  });

  stopwatchEnd(funcId);
});

/* -----------------------*/
/* -----HELPERS----*/
/* -----------------------*/

function constructDataObj(id, e) {
  let lineItem = $(e);
  return {
    id: id,
    name: getCarName(lineItem),
    model: $(".cars-tab-vehicle--model-span", lineItem).html(),
    image: $(".car-image", lineItem).attr("src"),
    fuelType: $('[fs-cmsfilter-field="gc-type"]', lineItem).html(),
    seats: $('[fs-cmsfilter-field="seats"]', lineItem).html(),
    driveType: $('[fs-cmsfilter-field="drive"]', lineItem).html(),
    bodyType: $('[fs-cmsfilter-field="body"]', lineItem).html(),
    greenScore: $('[fs-cmsfilter-field="new-green-score"]', lineItem).html(),
    electricRange: $('[fs-cmsfilter-field="electric-range"]', lineItem).html(),
    totalRange: $('[fs-cmsfilter-field="range"]', lineItem).html(),
    mpg: $('[fs-cmsfilter-field="mpg"]', lineItem).html(),
    speed: $('[fs-cmsfilter-field="speed"]', lineItem).html(),
    batteryCap: $('[fs-cmsfilter-field="battery"]', lineItem).html(),
    chargeTime: $('[fs-cmsfilter-field="time-to-charge"]', lineItem).html(),
    chargeTime240: $('[fs-cmsfilter-field="time-charge-240"]', lineItem).html(),
    milesKwh: $('[fs-cmsfilter-field="miles-per-kwh"]', lineItem).html(),
    performanceScore: $(
      '[fs-cmsfilter-field="performance-score"]',
      lineItem
    ).html(),
    baseMsrp: $('[fs-cmsfilter-field="base-msrp"]', lineItem).html(),
    totalMonthlyCost: $(
      '[fs-cmsfilter-field="total-monthly-cost"]',
      lineItem
    ).html(),
    energyCost: $('[fs-cmsfilter-field="mon-energy-cost"]', lineItem).html(),
    energyCostMile: $(
      '[fs-cmsfilter-field="energy-cost-mile"]',
      lineItem
    ).html(),
    affordabilityScore: $(
      '[fs-cmsfilter-field="affordability-score"]',
      lineItem
    ).html(),
    co2: $('[fs-cmsfilter-field="co2"]', lineItem).html(),
    environmentScore: $(
      '[fs-cmsfilter-field="environment-score"]',
      lineItem
    ).html(),
    epaSmogRating: $('[fs-cmsfilter-field="epa-smog-rating"]', lineItem).html(),
    fuelCost: $('[fs-cmsfilter-field="fuel-cost"]', lineItem).html(),
    youSaveSpend: $('[fs-cmsfilter-field="you-save-spend"]', lineItem).html(),
    shopDriveway: $('[fs-cmsfilter-field="shop-driveway"]', lineItem).html(),
    estPrice: $('[fs-cmsfilter-field="est-price"]', lineItem).html(),
    estPayment: $('[fs-cmsfilter-field="est-payment"]', lineItem).html(),
    costRangeMile: $('[fs-cmsfilter-field="cost-mile-range"]', lineItem).html(),
    federalUrl: $('[fs-cmsfilter-field="federal-url"]', lineItem).html(),
    preOrderUrl: $('[fs-cmsfilter-field="pre-order_url"]', lineItem).html()
  };
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0
});

const reFormat = (e) => {
  let formatted = formatter.format(e.text());
  $(e).text(formatted).attr("gc-event", "formatted");
};

const replaceGcScore = (e) => {
  let score = $(e).text();
  let leafs = drawGreenScoreLeafs(score);
  $(e).after(leafs);
  $(e).attr("gc-event", "score-replaced");
};

// Debugging
function stopwatchStart(funcName) {
  if (isDebug) console.time(funcName);
}

function stopwatchEnd(funcName) {
  if (isDebug) console.timeEnd(funcName);
}
