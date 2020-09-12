function addLocal(value) {
  let storage = getLocal() || [];
  window.localStorage.setItem("last-claim", storage.length);
  storage.push(value);
  window.localStorage.setItem("claims-array", JSON.stringify(storage));
}

function getLocal() {
  return JSON.parse(window.localStorage.getItem("claims-array"));
}

function setLastClaim(i) {
  window.localStorage.setItem("last-claim", i);
}

function getLastClaim() {
  let storage = getLocal();
  let index = window.localStorage.getItem("last-claim");
  console.log(storage, index);
  return storage[index];
}

function logLocal() {
  console.log(getLocal());
}

function showhideIntake() {
  let form = document.forms["intake-form"];
  let letterType = form["letter-type"].value;
  document.getElementById("stolen-c").style.display = letterType === "theft" ? "block" : "none";
  document.getElementById("murder-c").style.display = letterType === "murder" ? "block" : "none";
  document.getElementById("adultery-c").style.display = letterType === "adultery" ? "block" : "none";
}

function saveForm() {
  let form = document.forms["intake-form"];
  let formData = {
    fname: form.fname.value,
    lname: form.lname.value,
    stolen: form.stolen.value,
    murdered: form.murdered.value,
    adultered: form.adultered.value,
    "letter-type": form["letter-type"].value,
  }

  addLocal(formData);
}

function buildLetter() {
  let formData = getLastClaim();
  let content;
  switch(formData["letter-type"]) {
    case "theft":
      content = `Dear Mr. Thief,\n\n  This letter is to inform you that ${formData.fname} ${formData.lname} is upset about the ${formData.stolen} that you stole.  Please return it or face us in court!`;
      break;
    case "murder":
      content = `Dear Mr. Killer,\n\n  This letter is to inform you that ${formData.fname} ${formData.lname} is upset about the murder of ${formData.murdered}.  You will now face death.`;
      break;
    case "adultery":
      content = `Dear Mr. Adulterer,\n\n  This letter is to inform you that ${formData.fname} ${formData.lname} is upset about the adultery of ${formData.adultered}.  He will get his revenge.`;
      break;
  }
  
  document.getElementById("letter-content").innerHTML = content;
}

function loadClaims() {
  let container = document.getElementById("claims");
  let claims = getLocal();
  if (!claims || claims.length === 0) {
    let text = document.createTextNode("No claims found in the system");
    container.appendChild(text);
    let button = document.getElementById("clear-claims");
    button.style.display = 'none';
  } else {
    claims.forEach( (claim, i) => {
      let el = document.createElement("div");
      let text = document.createTextNode(claim.fname + ' ' + claim.lname + ': ' + claim["letter-type"]);
      let form = document.createElement("form");
      form.action="letter.html";
      let button = document.createElement("input");
      button.type = "submit";
      button.value = "Generate Letter";
      button.innerHTML = "Generate Letter";
      button.onclick = () => setLastClaim(i);

      let deleteB = document.createElement("button");
      deleteB.innerHTML = "X";
      deleteB.onclick = () => deleteClaim(i);

      form.appendChild(button);
      el.appendChild(text);
      el.appendChild(deleteB);
      el.appendChild(form);
      container.appendChild(el);
    });
  }
}

function deleteClaim(i) {
  let storage = getLocal();
  storage.splice(i, 1);
  window.localStorage.setItem("claims-array", JSON.stringify(storage));

  container = document.getElementById("claims");
  container.innerHTML = '';
  loadClaims();
}

function clearClaims() {
  window.localStorage.setItem("claims-array", null);

  container = document.getElementById("claims");
  container.innerHTML = '';
  loadClaims();
}