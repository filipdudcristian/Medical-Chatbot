import { useState } from "react";
import { Button } from "react-bootstrap";
import "./ChatApp.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useUserAuth } from "../context/UserAuthContext";
import { useNavigate } from "react-router-dom";
import {
 MainContainer,
 ChatContainer,
 MessageList,
 Message,
 MessageInput,
 TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

const ChatApp = () => {
 // State to manage the typing indicator of the chatbot
 const [isChatbotTyping, setIsChatbotTyping] = useState(false);
 const { logOut, user, role } = useUserAuth();
 const navigate = useNavigate();
 const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

 // State to store chat messages
 const [chatMessages, setChatMessages] = useState([
   {
     message: "Buna, sunt Doctorul Virtual si sunt aici pentru a va raspunde la intrebarile tale medicale",
     sender: "Doctorul Virtual",
   },
 ]);

 // Function to handle user messages
 const handleUserMessage = async (userMessage) => {
   // Create a new user message object
   const newUserMessage = {
     message: userMessage,
     sender: "user",
     direction: "outgoing",
   };

   // Update chat messages state with the new user message
   const updatedChatMessages = [...chatMessages, newUserMessage];
   setChatMessages(updatedChatMessages);

   // Set the typing indicator for the chatbot
   setIsChatbotTyping(true);

   // Process user message with ChatGPT
   await processUserMessageToChatGPT(updatedChatMessages);
 };

 // Function to send the user message to ChatGPT API
 async function processUserMessageToChatGPT(messages) {
  //console.log(messages)
   // Prepare the messages in the required format for the API
   let apiMessages = messages.map((messageObject) => {
     let role = "";
     if (messageObject.sender === "Doctorul Virtual") {
       role = "assistant";
     } else {
       role = "user";
     }
     return { role: role, content: messageObject.message };
   });

   console.log(messages.at(messages.length - 1).message)
   // System message for ChatGPT
   const systemMessage = {
     role: "system",
     content: "Explain all concept like a Professor in Biochemistry",
   };

   // Prepare the API request body
  //  const apiRequestBody = {
  //    model: "gpt-3.5-turbo",
  //    messages: [
  //      systemMessage, // System message should be in front of user messages
  //      ...apiMessages,
  //    ],
  //  };

  let prompt = messages.at(messages.length - 1).message

  const apiRequestBody = {
    prompt
  }

   // Send the user message to ChatGPT API
   await fetch("http://localhost:8080/chat", {
     method: "POST",
     headers: {
       "Content-Type": "application/json"
     },
     body: JSON.stringify(apiRequestBody),
   })
     .then((data) => {
       //console.log(data.json());
       return data.json();
     })
     .then((data) => {
       // Update chat messages with ChatGPT's response
       console.log(data);
       setChatMessages([
         ...messages,
         {
           //message: data.choices[0].message.content,
           message: data.message,
           sender: "Doctorul Virtual",
         },
       ]);
       // Set the typing indicator to false after getting the response
       setIsChatbotTyping(false);
     });
 }

 const handleUserAttach = async (e) => { 
 }

 return (
   <>
    
     {/* A container for the chat window */}
     <div style={{ position: "relative", height: "776px", width: "700px"}}>
       <div className="p-4 box user_info_chat" style={{borderRadius: "15px"}}>
        <div className="text-center user_info_chat_box">
          <h3>Bine ai venit, <br /></h3>
          <h4>{user}</h4>
        </div>
        
        <div className="d-grid gap-2 button_class">
            <Button className="text-center" variant="primary"  onClick={handleLogout}>
              Log out
            </Button>
            
        </div>
      </div>
       <MainContainer style={{ height: "70%", padding: "10px",borderRadius: "15px" }}>
         <ChatContainer >
           {/* Display chat messages and typing indicator */}
           <MessageList
             typingIndicator={
               isChatbotTyping ? (
                 <TypingIndicator content="Doctorul Virtual tasteaza..." />
               ) : null
             }
           >
             {/* Map through chat messages and render each message */}
             {chatMessages.map((message, i) => {
               return (
                 <Message
                   key={i}
                   model={message}
                   style={
                     message.sender === "Doctorul Virtual" ? { textAlign: "left" } : {}
                   }
                 />
               );
             })}
           </MessageList>
           {/* Input field for the user to type messages */}
           <MessageInput
             placeholder="Scrie mesajul aici"
             onSend={handleUserMessage}
             onAttachClick={(e) => this.handleUserAttach(e)}
           />
         </ChatContainer>
       </MainContainer>
     </div>
   </>
 );
}

export default ChatApp;