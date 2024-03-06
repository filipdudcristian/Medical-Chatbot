package com.utcn.doctorulvirtual.controllers;

import com.utcn.doctorulvirtual.controllers.models.LoginRequestModel;
import com.utcn.doctorulvirtual.controllers.models.LoginResponseModel;
import com.utcn.doctorulvirtual.controllers.models.SingUpRequestModel;
import com.utcn.doctorulvirtual.entities.Role;
import com.utcn.doctorulvirtual.entities.User;
import com.utcn.doctorulvirtual.repositories.RoleRepository;
import com.utcn.doctorulvirtual.repositories.UserRepository;
import com.utcn.doctorulvirtual.services.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@CrossOrigin
@Log4j2
public class AuthController {

    private final AuthenticationManager authenticationManager;

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    private final ChatService chatService;

    @PostMapping("/login") //API pentru logarea userului cu username/email si parola
    public ResponseEntity<LoginResponseModel> authenticateUser(@RequestBody LoginRequestModel loginRequestModel) {
        System.out.println(loginRequestModel.toString());
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequestModel.getUsernameOrEmail(), loginRequestModel.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication); //Autentificarea userului

        chatService.resetConversation(); //Reseteaza conversatia curenta cu chatbotul

        User user = userRepository.findByUsernameOrEmail(loginRequestModel.getUsernameOrEmail(), loginRequestModel.getUsernameOrEmail()).get(); //Trimite ca raspuns userul si rolul userului logat

        return new ResponseEntity<>(new LoginResponseModel(loginRequestModel.getUsernameOrEmail(), user.getRoles().stream().findFirst().get().getName()), HttpStatus.OK);
    }

    @PostMapping("/signup") //API-ul de inregistrare a unui nou utilizator
    public ResponseEntity<String> registerUser(@RequestBody SingUpRequestModel singUpRequestModel) {
        if (userRepository.existsByUsername(singUpRequestModel.getUsername())){
            return new ResponseEntity<>("Username-ul este deja utilizat!", HttpStatus.BAD_REQUEST); //Verificari daca un user exista deja cu email sau username la fel
        }

        if (userRepository.existsByEmail(singUpRequestModel.getEmail())){
            return new ResponseEntity<>("Email-ul este deja utilizat!", HttpStatus.BAD_REQUEST);
        }

        User user = User.builder()
                .email(singUpRequestModel.getEmail())
                .username(singUpRequestModel.getUsername())
                .name(singUpRequestModel.getName())
                .password(passwordEncoder.encode(singUpRequestModel.getPassword()))
                .build();   //Creearea unui user pentru baza de date

        Role role = roleRepository.findByName("ROLE_USER").get();
        user.setRoles(Collections.singleton(role)); //Asigneaza rolul de user simplu

        try {
            userRepository.save(user); //Salveaza noul model de user in baza de date
        }catch (Exception e) {
            return new ResponseEntity<>("Userul nu a putut fi salvat!", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("User-ul a fost inregistrat cu succes!", HttpStatus.OK);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {

        List<User> users = userRepository.findAll();

        users = users.stream().filter(u -> u.getRoles().stream().findFirst().get().getName().equalsIgnoreCase("ROLE_USER")).toList();

        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId){

        Optional<User> user = userRepository.findById(userId);

        if (user.isEmpty()){
            return new ResponseEntity<>("Userul nu exista!", HttpStatus.BAD_REQUEST);
        }

        userRepository.deleteById(userId);

        return new ResponseEntity<>("Userul a fost sters cu succes!", HttpStatus.OK);
    }

}
