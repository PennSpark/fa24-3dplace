# Penn Place  

**_Written By: Shaurya Sarma_**  

**Live at:** [**www.penn.place**](https://penn.place)  
**Event Dates:** December 1–7, 2024  

## **Overview** 

Penn Place is a **collaborative digital art experiment** created over an eight-week span, inviting users to design 3D art in a **shared voxel grid**. Inspired by [Reddit’s r/place](https://www.reddit.com/r/place), this platform allows participants to place colored voxels (blocks) in a 3D space, shaping a dynamic digital canvas in **real time**.  

The project combines the interactive nature of 3D art with Penn's campus culture, enabling students to collectively create a unique visual experience.  

**Team Members:**  
- **Project Leads:** Shaurya Sarma, Joyce Chen  
- **Developers:** Luka Koll, Term Taepaisitphongse  
- **Designers:** Lori Brown, Nond Phokasub, Yue Zhao  

---

## **Results**  

- **User Engagement Metrics:** [to be updated]  
- **Timelapse Video:** [to be updated]  
- **Total Blocks Placed:** [to be updated]  
- **Highlights:** Screenshots of notable creations  
- **Flyover Video:** 3D exploration of the final canvas  

---

## **Design**  

### **User Experience**  
We analyzed Reddit's r/place UI design and tools like [three.js's editor](https://threejs.org/editor) to create a streamlined and accessible experience. Our primary focus was to minimize interactions required to place a block, while ensuring smooth usability across devices. We prioritized laptop -> mobile -> desktop devices as we expected these devices would be the most frequented among our targeted userbase. 

Key features included:  
- **Toolbar:** For quick access to essential actions.  
- **Mode Slider:** To toggle between building and moving.  
- **Quick Guide:** Simple onboarding for first-time users.  
- **Color Palette:** Easy color selection for voxel placement.  
- **Feedback Button:** To collect user suggestions.  

### **Device Optimization**  
We prioritized usability based on the expected interaction devices:  
1. **Laptops with Trackpads:** Optimized two-finger panning and zoom.  
2. **Mobile/Tablet:** Basic compatibility for first-time interactions.  
3. **Desktops:** Tailored features for extended functionality.  

### **Visual Enhancements**  
- **Design Aesthetic:** Glassmorphism for a clean, modern look. Minimalism to keep UI uncluttered and easy to use.  
- **Grid Optimization:** Adjusted opacity and explored shader effects to reduce moiré patterns.  

---

## **Implementation**  

### **3D Voxel Canvas**  
Penn Place extended the 2D grid concept of r/place into 3D, introducing vertical building through an additional z-axis.  

#### **Voxel Placement**  
- **Grid Snapping:** Mouse positions snapped to predefined grid cells for accuracy.

We started off creating a subdivided 2D plane mesh where a voxel could be placed within each cell. By tracking the mouse position and flooring the coordinates according to the grid's cell dimensions, we created a snapping mechanism with the mouse cursor. 
  
- **Vertical Building:** Voxels could only be placed adjacent to existing blocks, inspired by Minecraft.

Blocks can be placed anywhere on the 2D "ground" plane but to build vertically, a voxel must be originally connected to an adjacent voxel. This meant we had to adjust our voxel placement algorithm to use the normals of other voxel meshes. By summing the normal face vector, we were able to calculate a new voxel position that extended into the z-axis. 

#### **Technical Challenges**  
- **Moiré Effect:** Reduced grid line opacity to minimize harsh visual artifacts.  
- **Infinite Canvas Considerations:** Explored but rejected due to backend complexity.

---

### **Backend Architecture**  

Real-time collaboration was powered by **WebSockets**, allowing users to see updates on the canvas immediately after a block was placed.  

#### **Data Storage and Efficiency**  
Inspired by [Reddit’s r/place blogpost](https://redditinc.com/blog/how-we-built-rplace), we implemented a scalable backend using **MongoDB** and **Redis**. We talked with one of the author devs of the blogpost to gain a better understanding of Reddit's backend architecture so we could adapt it for Penn Place. 
- **MongoDB:** Persistent long-term storage for the final timelapse.  
- **Redis:** Distributed cache to ensure low-latency updates.  

#### **Voxel Data Representation**  
- Stored the canvas as a single binary sequence using Redis bitfields.  
- Represented each voxel’s color with a 4-bit integer. Implicity stored voxel's (x,y,z) coordinates based on posiition in binary string. 
- Flattened 3D grid into a 1D sequence using the offset formula:  
  `index = x + BOARD_SIZE * z + BOARD_SIZE * BOARD_SIZE * y`  

#### **Scalability**  
Though hosted on a single server, the architecture supports future expansion to multiple servers for larger user bases.  

---

## **Conclusion**  

Penn Place successfully explored a 3D digital art experience with real-time collaboration. It was exciting seeing how users shaped the canvas overtime and seeing popular.. type later


