import { useEffect, useState } from "react";

/* =========================
   EVENT TYPE
========================= */
interface Event {
  _id: string;
  name: string;
  certificateType: string;
  date: string;
  participants: number;
  status: string;
}

export function EventManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [certificateType, setCertificateType] = useState("Participation");
  const [date, setDate] = useState("");
  const [participants, setParticipants] = useState(0);

  /* =========================
     FETCH EVENTS
  ========================= */
  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/events");
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      console.log("Fetch error:", err);
      setEvents([]);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  /* =========================
     CREATE EVENT
  ========================= */
  const handleCreate = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          certificateType,
          date,
          participants,
        }),
      });

      if (!res.ok) throw new Error("Failed to create event");

      await res.json();

      setName("");
      setCertificateType("Participation");
      setDate("");
      setParticipants(0);
      setShowModal(false);

      fetchEvents();
    } catch (err) {
      console.log("Create error:", err);
    }
  };

  /* =========================
     DELETE EVENT (NEW)
  ========================= */
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/events/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      setEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  return (
    <div className="p-6">

      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Event Management</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Event
        </button>
      </div>

      {/* EVENTS */}
      {events.length === 0 ? (
        <p>No events found</p>
      ) : (
        events.map((event) => (
          <div
            key={event._id}
            className="border p-4 mb-2 rounded flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold">{event.name}</h3>
              <p>Type: {event.certificateType}</p>
              <p>Date: {event.date}</p>
              <p>Participants: {event.participants}</p>
              <p>Status: {event.status}</p>
            </div>

            {/* DELETE BUTTON */}
            <button
              onClick={() => handleDelete(event._id)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 w-96 rounded-lg">

            <h2 className="text-xl font-bold mb-4">Create New Event</h2>

            <input
              type="text"
              placeholder="Event Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full mb-3"
            />

            <select
              value={certificateType}
              onChange={(e) => setCertificateType(e.target.value)}
              className="border p-2 w-full mb-3"
            >
              <option value="Participation">Participation</option>
              <option value="Achievement">Achievement</option>
              <option value="Appreciation">Appreciation</option>
              <option value="Completion">Completion</option>
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border p-2 w-full mb-3"
            />

            <input
              type="number"
              placeholder="Participants"
              value={participants}
              onChange={(e) =>
                setParticipants(Number(e.target.value))
              }
              className="border p-2 w-full mb-3"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Create
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}