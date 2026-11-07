import fs from 'fs';
import path from 'path';

export const DEMO_DIR = path.join(__dirname, '../../data/demo_student_workspace');

export function createDemoFiles(): string {
  if (!fs.existsSync(DEMO_DIR)) {
    fs.mkdirSync(DEMO_DIR, { recursive: true });
  }

  const filesToCreate = [
    // 1. Study Materials - DBMS
    { name: 'DBMS_Unit_3_Normalization_Notes.pdf', content: 'Database Normalization: 1NF, 2NF, 3NF, BCNF rules and functional dependencies.' },
    { name: 'finalfinalnotes.pdf', content: 'Database Normalization: 1NF, 2NF, 3NF, BCNF rules and functional dependencies.' }, // Exact duplicate
    { name: 'DBMS_Unit_3_Normalization_Notes (1).pdf', content: 'Database Normalization: 1NF, 2NF, 3NF, BCNF rules and functional dependencies.' }, // Exact duplicate copy
    { name: 'DBMS_ER_Diagram_Assignment.docx', content: 'Entity Relationship modeling for University Course Registration system.' },

    // 2. Study Materials - DSA & Algorithms
    { name: 'DSA_Binary_Search_Tree_Traversal.java', content: 'public class BST { void inOrder(Node root) { /* In-order left, root, right */ } }' },
    { name: 'DSA_Graph_BFS_DFS_Implementation.cpp', content: '#include <iostream>\n#include <vector>\n// Graph BFS Traversal' },
    { name: 'DSA_Lecture_Slides_Trees_Graphs.pdf', content: 'Lecture 14: AVL Trees, Red-Black Trees, Graph adjacency lists.' },

    // 3. Study Materials - Operating Systems
    { name: 'OS_Deadlock_Detection_Bankers_Algorithm.py', content: 'def bankers_algorithm(alloc, max_req, avail): return True' },
    { name: 'OS_Process_Scheduling_SJF_RoundRobin.c', content: '#include <stdio.h>\n// Round Robin scheduling quantum = 4ms' },
    { name: 'OS_MidTerm_Question_Paper_2025.pdf', content: 'Semester 4 Operating Systems Mid-term Exam: Paging and Virtual Memory.' },

    // 4. Code & Projects
    { name: 'server.js', content: 'const express = require("express"); const app = express(); app.listen(3000);' },
    { name: 'App.tsx', content: 'import React from "react"; export const App = () => <div>Hello FileFlow</div>;' },
    { name: 'schema.sql', content: 'CREATE TABLE students (id INT PRIMARY KEY, name VARCHAR(100), gpa FLOAT);' },

    // 5. Personal / Career Files
    { name: 'Resume_CSE_Internship_2026.pdf', content: 'Abhishek - 2nd Year CSE Student. Skills: TypeScript, React, Java, DBMS.' },
    { name: 'Resume_CSE_Internship_2026_draft.pdf', content: 'Abhishek - 2nd Year CSE Student. Skills: TypeScript, React, Java, DBMS, Node.' }, // Near duplicate
    { name: 'College_ID_Card_Scan.jpg', content: 'BINARY_IMAGE_DATA_COLLEGE_ID_2026_SEMESTER_CARD_STAMP' },
    { name: 'College_ID_Card_Scan_compressed.jpg', content: 'BINARY_IMAGE_DATA_COLLEGE_ID_2026_SEMESTER_CARD_STAMP_LOW' }, // Perceptual match

    // 6. Media / Camera Photos & Screenshots
    { name: 'IMG_20260815_Campus_Fest.jpg', content: 'IMAGE_RAW_BINARY_DATA_CAMPUS_FEST_CROWD_STAGE' },
    { name: 'IMG_20260815_Campus_Fest_copy.jpg', content: 'IMAGE_RAW_BINARY_DATA_CAMPUS_FEST_CROWD_STAGE' }, // Exact duplicate photo
    { name: 'Screenshot (14).png', content: 'SCREENSHOT_OF_ERROR_CONSOLE_NULL_POINTER_EXCEPTION' },
    { name: 'Screenshot (15).png', content: 'SCREENSHOT_OF_ERROR_CONSOLE_NULL_POINTER_EXCEPTION' }, // Duplicate screenshot

    // 7. Messy / Temporary files
    { name: 'temp_notes_3981.tmp', content: 'scratch memory unsaved draft' },
    { name: 'VSCodeUserSetup-x64-1.92.2.exe', content: 'MOCK_INSTALLER_BINARY_DATA_EXE' },
    { name: 'cse_semester_project_archive.zip', content: 'MOCK_ZIP_ARCHIVE_DATA_PROJECT' },
  ];

  for (const item of filesToCreate) {
    const filePath = path.join(DEMO_DIR, item.name);
    fs.writeFileSync(filePath, item.content);
  }

  // Create empty subdirectories to demonstrate clean-up
  const emptyFolder1 = path.join(DEMO_DIR, 'Empty_Temp_Cache');
  const emptyFolder2 = path.join(DEMO_DIR, 'Old_Drafts');
  if (!fs.existsSync(emptyFolder1)) fs.mkdirSync(emptyFolder1);
  if (!fs.existsSync(emptyFolder2)) fs.mkdirSync(emptyFolder2);

  return DEMO_DIR;
}
