const saveBtn = document.getElementById("saveBtn");
const deleteBtn = document.getElementById("deleteBtn");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const notesContainer = document.getElementById("notesContainer");

// function to clear the form
const clearForm = () => {
	titleInput.value = "";
	descriptionInput.value = "";
	deleteBtn.classList.add("hidden");
	saveBtn.innerText = "Save";
	saveBtn.classList.remove("bg-[#32CD32]");
	saveBtn.removeAttribute("data-id");
}

const formValidation = (title, description) => {
	if (title === "" || description === "") {
		alert("Please fill in all fields");
		return false;
	}
	return true;
}

// function to get a note by id
const getNoteById = (id) => {
	fetch(`https://localhost:7224/api/notes/${id}`)
		.then(data => data.json())
		.then(res => displayNoteInForm(res))
}

// function to display a note in the form
const displayNoteInForm = (note) => {
	titleInput.value = note.title;
	descriptionInput.value = note.description;
	deleteBtn.classList.remove("hidden");
	deleteBtn.setAttribute("data-id", note.id);
	saveBtn.setAttribute("data-id", note.id);
	saveBtn.innerText = "Update";
	saveBtn.classList.add("bg-[#32CD32]");
}

// function to add a note
const addNote = (title, description) => {

	if (!formValidation(title, description)) return;

	const body = {
		title: title,
		description: description,
		isVisible: true,
	}

	fetch("https://localhost:7224/api/Notes", {
		method: "POST",
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json"
		}
	})
		.then(data => data.json())
		.then(res => {
			clearForm();
			getNotes();
		})
};


// function to display notes
const displayNotes = (notes) => {
	let allNotes = '';

	notes.forEach(note => {
		const noteElement = `<div data-id="${note.id}" id="note" class="transition-all bg-[#eee] p-[30px] w-[25%] [&>*]:mb-[10px] mr-[30px] cursor-pointer">
										<h3 class="font-bold">${note.title}</h3>
										<p class="overflow-auto max-h-[200px] text-[13px]">${note.description}</p>
									</div>
								`
		allNotes += noteElement;
	})

	notesContainer.innerHTML = allNotes;

	// add event listener to each note
	const note = document.querySelectorAll("#note");
	note.forEach(note => {
		note.addEventListener("click", () => {
			getNoteById(note.dataset.id);

			// remove bg color from other notes
			note.parentElement.childNodes.forEach(note => {
				if (note.id === "note") {
					note.classList.remove("bg-slate-300");
					note.classList.remove("scale-110");
				}
			})

			note.classList.add("bg-slate-300");
			note.classList.add("scale-110");
		})
	})
}


// function to get all notes
const getNotes = () => {
	fetch("https://localhost:7224/api/Notes")
		.then(data => data.json())
		.then(res => displayNotes(res))
};


// function to delete a note
const deleteNote = (id) => {
	fetch(`https://localhost:7224/api/notes/${id}`, {
		method: "DELETE"
	})
		.then(res => {
			clearForm();
			getNotes();
		})
};


// function to update a note
const updateNote = (id, title, description) => {

	if (!formValidation(title, description)) return;

	const body = {
		title: title,
		description: description,
		isVisible: true,
	}

	fetch(`https://localhost:7224/api/notes/${id}`, {
		method: "PUT",
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json"
		}
	})
		.then(res => {
			clearForm();
			getNotes();
			alert("Note updated successfully");
		})
};

// create an event listener for the save button
saveBtn.addEventListener("click", () => {
	if (saveBtn.dataset.id) {
		updateNote(saveBtn.dataset.id, titleInput.value, descriptionInput.value);
	} else {
		addNote(titleInput.value, descriptionInput.value);
	}
});

// create an event listener for the delete button
deleteBtn.addEventListener("click", () => {
	const id = deleteBtn.dataset.id;
	deleteNote(id);
});

// body click event listener
document.body.addEventListener("click", (e) => {
	if (e.target.id !== "note" && e.target.id !== "title" && e.target.id !== "description" && e.target.id !== "saveBtn" && e.target.id !== "deleteBtn" && e.target.id !== "notesSidebar") {
		clearForm();
	}
});


getNotes();