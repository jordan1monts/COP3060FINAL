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
