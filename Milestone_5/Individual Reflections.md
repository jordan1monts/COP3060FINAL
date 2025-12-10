# Individual Reflections

**Name:** Clemenceau Senatus  
**Date:** 12/9/2025  
**Course:** COP3060  
**Project:** Job Suggestions Application

---
1. Personal Contributions

My main responsibility in this project was making sure the React frontend and Spring Boot backend communicated smoothly at all times. I implemented the full JWT authentication workflow, including token generation, validation, and axios interceptors so tokens were automatically handled without user intervention. I created all REST API endpoints for the CRUD features and integrated the OpenRouter external API with proper timeout and rate-limit handling to prevent crashes. I also configured Spring Security, CORS rules, and resolved several HTTP 405 and 500 errors that were blocking requests. For testing, I manually walked through every authentication flow, tested protected routes, and simulated failure scenarios for both local APIs and the external API. I documented all major configurations, endpoints, and troubleshooting instructions in the README files to support the entire team.

2. Technical Growth

This project significantly expanded my understanding of Spring Security, JWT architecture, and REST API design. The hardest challenge was creating a secure, smooth authentication system where tokens were automatically attached in the frontend and validated correctly on the backend. I solved this by building custom axios interceptors and a JwtAuthenticationFilter that enforced security rules. Another major challenge was handling external API failures without breaking the app. Adding retry logic, timeouts, and structured error messages taught me the importance of resilience and defensive programming.
If I repeated this project, I would set up automated integration tests earlier and take more time studying Spring Security’s internal flow before implementation. Moving forward, I want to strengthen my API design skills and deepen my understanding of security patterns.

3. Teamwork Reflection

Our team coordinated through GitHub and group chats, which helped divide responsibilities clearly. This allowed me to focus on backend-frontend integration while others handled database modeling and UI work. I collaborated closely with frontend developers to make sure requests and responses matched correctly, and I worked with the database team to align endpoint structures with the data model. Debugging issues as a group was especially effective when solving complex errors. Overall collaboration was strong, we had a structured communication and planning workflow. I took the role of full-stack developer to tie everything together after each member completed their respective parts. This was essential because it connected all major parts of the application.

4. Ethical Considerations

I used AI tools like ChatGPT and GitHub Copilot only to understand complex frameworks such as JWT and Spring Security. Any AI-generated ideas were rewritten, reviewed, and tested thoroughly. We stayed transparent in documentation and made sure AI did not replace learning or introduce unsafe practices.
Protecting user data was a major priority. I implemented JWT expiration, secured endpoints, and restrictive CORS settings. The system collects only necessary data, and external API requests do not expose personal information.

5. Future Plans

In the future, I would add token refresh functionality and caching for the external API. This project strengthened my interest in backend and full-stack development. I plan to continue learning cloud technologies like AWS, container tools like Docker, and more advanced Spring Security techniques including OAuth2.

6. Overall Reflection

The most impactful part of this project was building the authentication system from scratch. It helped me understand not only how JWT works but why good security practices matter. The sample code provided to us by the professor definitely came in handy later, allowing me to compare my initial custom implementation against a working model and debug subtle issues in the token validation flow. Debugging integration issues deepened my understanding of CORS, HTTP headers, and request flows. Working with external APIs taught me how to design systems that fail gracefully instead of breaking.
Overall, this project turned a lot of theoretical knowledge into real, practical experience and gave me confidence to handle complex software engineering challenges.

---

# Individual Reflections

Name: Caleb Parker 
Date: 12/9/2025  
Course: COP3060  
Project: Job Suggestions Application
---

## 1. Personal Contributions

My primary contributions within this project was focused on creating the backdrop for the project both technically and conceptually. My responsibilities included the project proposal, introducing the idea and the methodologies for creating the job application app and connecting the ideas behind why the app was worthwhile to do. Furthermore, asking key questions to the group and challenging what they already know about job application apps and how we can refine ours. Within the project proposal, I covered the essentials of the pros, cons and the evaluated the best strategies that would come through a demo application, from a conceptual point of view. Additionally, I worked on the database integration part of the project. I worked with Clemenceau additionally and we reviewed each others code and refined our code in order to connect this to the backend of the project. These were with the focus of a user's description, personality and shared history when they are taking the job application survey in the app.

Outside of these, I also helped with additional supporting documents to help with organization, if needed. I didn't do this in every Milestone, but did so in Milestone #1 and #2. 

---

## 2. Technical Growth

Technically speaking the skills I gained the most was working more with SQL, requirements gathering, focused assessments using SpringBoot and working more with Postman. I used these the most throughout the project given my roles and given the focus on our job application application for our project.

### Challenges Overcome

The challenges that I overcame was working with my team on tightdeadlines. I believe this was the hardest adjustment since we had a quick turnaround time to do all the work that required for us to do. Especially as we were going into Thanksgiving Break and came out of it, it was difficult to focus on both recovery time and get my project done, so overcoming these tightdeadlines are the biggest adaptation that I've found in this process. Fortunatley through constant communication and adaptation our team was able to move forward and were able to come up with a solution. 

I have gained better skills in the regard of time-management as a result, and have become aware of how quickly time passes, irrespective of how urgent or the lack thereof we are for our project.  

### Areas for Improvement
Personally what I could've done better is be more pro-active in the work I could've done. During these last few weeks I've had a lot of responsibilities I needed to juggle, however I could have done more for the group, and could've done more on my end(at times) as well. 

Although our project is demo-ready and is works pretty well, in the future I need to develop the drive to not only do my work when it is due but also do it whenever it first comes up on my timeline.

---

## 3. Teamwork Reflection

### Collaboration
My teammates were great. I didn't have any problems with anyone and we were able to commmunicate fluidly and effectively. We all communicated consistently, set up meetings times that we were all avaliable for(via zoom) and made sure we did our work as we all agreed to do(for the parts we agreed to do).

### Team Dynamics
The best parts of my team was our:
- Communication
- Consistent Activity/Reliability
- Adaptability
- Checking in to Canvas on a daily/weekly rate, without being informed to do so. 

- **What could be improved?**
While the team was great, we were not perfect, we can improve on: 
- Challenging eacch other more to create more creative ideas.
- Be more involved collaboratively as problem-solving as a group. - Often times when we did our parts we didn't collaborate with each oter on that. While we communicated about deadlines, our avaliabilities, responsibilities etc. once we got our assignments we didn't do much collaboration from there. I think having more of a balance would make it better for future team projects. 

### Role in Team
My primary role on the team was being the team's coordinator, visionary, conceptual-mapper, and database integrater/designer(connecting with the Backend code). 

## 4. Ethical Considerations

### AI Usage
- AI was used in this project as a medium through OPEN AI apart of our integration for our job application survey. It played a pivitol role in predicting what kind of jobs would be best for a person who fits a specific personality or work-type, and based on these estimations would help our users determine where there next best fit would be. 

- **Ethical concerns addressed:**
- Particulary, our problems in this project largley revolved around bias, and determining how would a candidate to be assessed objectively with the mitigation of as much bias as possible. We concluded that in order for this to happen, we must get rid of knowledge-based assumptions ans biases, such as those associated with age, gender, social class, race, and fluid(or qualitative) types of information that could be better intepreted or skewed into a specific direction. Therefore, removing these biases, we were able to get an accurate model of how to assess a candidate without pre-judging them.

Nevertheless, while these concerns are addressed, there is no way to 100% get rid of bias, nevertheless in removing the biases in our application it allows us to get more accurate results with respect to the person, and not with snapshots of external traits. 


## 5. Future Plans

The future of our website, job application app is to move it into beta or a functional app. While it would only serve in a limited capacity this would allow for users to interactive with our product and see if it is effective and useful for people who are interested in job changes, beginning a new career or just wants to learn more about themselves career-wise. 

Additionally, stylizing our apps is another thing we would need to do. In order for our app to gain good traction, it would require a good image and one way we could utilize this would be to use HTML and CSS. While using these we could customize our website in a way that our users approve of, and consequentially it would bring more traffic to our application.

---

## 6. Overall Reflection

### My Experience + Final Thoughts
The most valuable and impactful experiences that happend to me while undertaking the project included really getting an understanding of how SpringBoot works with databases and how it connects with multiple "codenetworks"(aka. front-end and backend etc.), to become a  usable for applicaiton users. Working and seeing this in a behind-the-scenes-view helps me understand the amount of effort, dedication and precision it takes to build, sustain and improve these systems in real-world contexts. And not only so just for software engineering principles, and database management, but just as important(if not more) also for AI integration, and how AI can be readily used as a service when it is applied in the right way. 

My key takeaways include learning more about: 
- Software Engineering coding principles
- Database Management Software and Integration - SpringBoot, MySQL WorkBench, AI Integration etc.
- Requirements Gathering - functional and non-functional etc.
- Conceptual focus on project aims, goals, defining scope and evaluating the ethical parts of system integration. 

Overall the project was fluid, and while there were some parts that were difficult and took longer to do(especially due to the time) we were able to come together and make a succesful demo. My team was responsive and we were able to do our work to a successful end throughout the 4 week period. 

---


