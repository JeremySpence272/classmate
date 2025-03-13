const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3001; // Using 3001 since Next.js uses 3000

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = new sqlite3.Database('./classmate.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create a new class
app.post('/api/classes', (req, res) => {
  const { title, type, meetings } = req.body;
  
  if (!title || !type) {
    return res.status(400).json({ error: 'Title and type are required' });
  }

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    const insertClassSql = 'INSERT INTO classes (title, type) VALUES (?, ?)';
    
    db.run(insertClassSql, [title, type], function(err) {
      if (err) {
        db.run('ROLLBACK');
        console.error(err);
        return res.status(500).json({ error: 'Error creating class' });
      }
      
      const classId = this.lastID;
      
      if (meetings && meetings.length > 0) {
        const insertMeetingSql = 'INSERT INTO class_meetings (class_id, day, start_time, end_time) VALUES (?, ?, ?, ?)';
        
        const insertMeetings = meetings.map(meeting => {
          return new Promise((resolve, reject) => {
            db.run(insertMeetingSql, [classId, meeting.day, meeting.startTime, meeting.endTime], (err) => {
              if (err) reject(err);
              else resolve();
            });
          });
        });

        Promise.all(insertMeetings)
          .then(() => {
            db.run('COMMIT');
            res.status(201).json({
              id: classId,
              title,
              type,
              meetings
            });
          })
          .catch(err => {
            db.run('ROLLBACK');
            console.error(err);
            res.status(500).json({ error: 'Error creating class meetings' });
          });
      } else {
        db.run('COMMIT');
        res.status(201).json({
          id: classId,
          title,
          type,
          meetings: []
        });
      }
    });
  });
});

// Get all classes with their meetings
app.get('/api/classes', (req, res) => {
  const sql = `
    SELECT 
      c.*,
      json_group_array(
        json_object(
          'id', m.id,
          'day', m.day,
          'startTime', m.start_time,
          'endTime', m.end_time
        )
      ) as meetings
    FROM classes c
    LEFT JOIN class_meetings m ON c.id = m.class_id
    GROUP BY c.id
    ORDER BY c.created_at DESC
  `;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error fetching classes' });
    }
    
    // Parse the meetings JSON string for each row
    const classes = rows.map(row => ({
      ...row,
      meetings: JSON.parse(row.meetings).filter(m => m.id !== null) // Filter out null meetings from LEFT JOIN
    }));
    
    res.json(classes);
  });
});

// Update a class
app.put('/api/classes/:id', (req, res) => {
  const { id } = req.params;
  const { title, type, meetings } = req.body;

  if (!title || !type) {
    return res.status(400).json({ error: 'Title and type are required' });
  }

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    const updateClassSql = 'UPDATE classes SET title = ?, type = ? WHERE id = ?';
    
    db.run(updateClassSql, [title, type, id], function(err) {
      if (err) {
        db.run('ROLLBACK');
        console.error(err);
        return res.status(500).json({ error: 'Error updating class' });
      }

      // Clear existing meetings for the class
      const deleteMeetingsSql = 'DELETE FROM class_meetings WHERE class_id = ?';
      db.run(deleteMeetingsSql, [id], (err) => {
        if (err) {
          db.run('ROLLBACK');
          console.error(err);
          return res.status(500).json({ error: 'Error deleting existing meetings' });
        }

        if (meetings && meetings.length > 0) {
          const insertMeetingSql = 'INSERT INTO class_meetings (class_id, day, start_time, end_time) VALUES (?, ?, ?, ?)';
          
          const insertMeetings = meetings.map(meeting => {
            return new Promise((resolve, reject) => {
              db.run(insertMeetingSql, [id, meeting.day, meeting.startTime, meeting.endTime], (err) => {
                if (err) reject(err);
                else resolve();
              });
            });
          });

          Promise.all(insertMeetings)
            .then(() => {
              db.run('COMMIT');
              res.status(200).json({
                id,
                title,
                type,
                meetings
              });
            })
            .catch(err => {
              db.run('ROLLBACK');
              console.error(err);
              res.status(500).json({ error: 'Error updating class meetings' });
            });
        } else {
          db.run('COMMIT');
          res.status(200).json({
            id,
            title,
            type,
            meetings: []
          });
        }
      });
    });
  });
});

// Delete a class
app.delete('/api/classes/:id', (req, res) => {
  const { id } = req.params;

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    // First delete all meetings associated with the class
    const deleteMeetingsSql = 'DELETE FROM class_meetings WHERE class_id = ?';
    db.run(deleteMeetingsSql, [id], (err) => {
      if (err) {
        db.run('ROLLBACK');
        console.error(err);
        return res.status(500).json({ error: 'Error deleting class meetings' });
      }

      // Then delete the class itself
      const deleteClassSql = 'DELETE FROM classes WHERE id = ?';
      db.run(deleteClassSql, [id], function(err) {
        if (err) {
          db.run('ROLLBACK');
          console.error(err);
          return res.status(500).json({ error: 'Error deleting class' });
        }

        // Check if any rows were affected
        if (this.changes === 0) {
          db.run('ROLLBACK');
          return res.status(404).json({ error: 'Class not found' });
        }

        db.run('COMMIT');
        res.status(200).json({ message: 'Class deleted successfully', id });
      });
    });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 