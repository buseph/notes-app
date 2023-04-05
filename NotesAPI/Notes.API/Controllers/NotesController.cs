using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Notes.API.Data;
using Notes.API.Models.Entities;

namespace Notes.API.Controllers
{
    [ApiController] // This is an API controller
    [Route("api/[controller]")] // This is the route to the controller
    public class NotesController : Controller
    {
        // Inject the NotesDbContext into the controller
        private readonly NotesDbContext notesDbContext;

        // Constructor
        public NotesController(NotesDbContext notesDbContext)
        {
            this.notesDbContext = notesDbContext;
        }

        // GET api/notes
        [HttpGet]
        public async Task<IActionResult> GetAllNotes()
        {
            // Get the notes from the database
            return Ok(await notesDbContext.Notes.ToListAsync());

        }


        [HttpGet]
        [Route("{id:Guid}")]
        [ActionName("GetNoteById")]
        public async Task<IActionResult> GetNoteById([FromRoute] Guid id)
        {
            // Get note by Id
            var note = await notesDbContext.Notes.FindAsync(id);

            if (note == null)
            {
                return NotFound();
            }

            return Ok(note);
        }


        [HttpPost]
        public async Task<IActionResult> AddNote(Note note)
        {
            note.Id = Guid.NewGuid();
            await notesDbContext.Notes.AddAsync(note);
            await notesDbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNoteById), new { id = note.Id}, note);
        }


        [HttpPut]
        [Route("{id:Guid}")]
        public async Task<IActionResult> UpdateNote([FromRoute] Guid id, [FromBody] Note updatedNote)
        {
            var existingNote = await notesDbContext.Notes.FindAsync(id);

            if (existingNote == null)
            {
                return BadRequest();
            }

            existingNote.Title = updatedNote.Title;
            existingNote.Description = updatedNote.Description;
            existingNote.IsVisible = updatedNote.IsVisible;

            await notesDbContext.SaveChangesAsync();

            return Ok(existingNote);
        }


        [HttpDelete]
        [Route("{id:Guid}")]
        public async Task<IActionResult> DeleteNote([FromRoute] Guid id)
        {
            var note = await notesDbContext.Notes.FindAsync(id);

            if(note == null)
            {
                return BadRequest();
            }

            notesDbContext.Notes.Remove(note);
            await notesDbContext.SaveChangesAsync();

            return Ok();
        }
    }
}
