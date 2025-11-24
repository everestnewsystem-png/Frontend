// src/pages/GenerateContract.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../api";
import TopStrip from "../components/top-strip";
import SecondStrip from "../components/second-strip";
import { Printer } from "lucide-react";

// ========== TEMPLATES (EXACT TEXT YOU PROVIDED) ==========

const employmentEnTemplate = `INDIVIDUAL CONTRACT OF EMPLOYMENT 
Concluded and registered under no. . .... in the General Registry of employees:

       
A. Parties of the contract:
  Employer: {OFFERCOMPANY.NAME}., headquartered in  {offercompany.address}, registered within Register of Companies under no.  {OFFERCOMPANY.TRADEREGNO} , fiscal code {offercompany.cui}, duly represented by {OFFERCOMPANY.DIRECTORNAME}, as C.E.O. of the company.

And,

 Employee –{cimApplicant.englishtitle}. {CIMAPPLICANT.NAME}, citizen of {cimApplicant.country}, born in {cimApplicant.dob}, in {CIMAPPLICANT.BIRTHPLACE}, {cimApplicant.country}, holder of passport no. {CIMAPPLICANT.PASSPORT}, issued by {cimApplicant.passportissuedby} authorities, on {cimApplicant.issuedate} valid until {cimApplicant.expirydate}, authorized work permit no. {cimApplicant.workpermitno} dated {cimApplicant.workpermitdate} and CNP {cimApplicant.cnp}.
have concluded the hereby individual employment contract under the following conditions that we have agreed upon:
      
B. Object of the Contract:
The performance by the employee of the work corresponding to the position, for and under the authority of the employer, under the conditions agreed by this contract.

    
C. Duration of the contract:
    Indefinite period of time, employee {CIMAPPLICANT.NAME} , to start the activity on the date of arrival in Romania.

     
    D. Place of work:
    1. The activity is carried out on the working point.
    2. In the absence of a fixed job, the employee will carry out the activity as follows:
........ (in the field / at the customers' premises / geographical area ......., group of units, etc.). In this case, the employee will benefit from: ............ .
 a) additional benefits .......-...... (in money or in kind);
 b) insurance / settlement of the transport by the employer .......-....... (as the case may be) . 

      
 E. Type of work
Function/occupation – {cimApplicant.jobtitle} - Cod COR {cimApplicant.corcode}  
according to the Classification of Occupations in Romania.

     
F. Job duties
The duties of the position are provided in the job description, attached to the individual employment contract.

     
F1. The criteria for evaluating the employee's professional activity:
The evaluation criteria are mentioned in the job description, attached to the individual employment contract.
- fulfilling work tasks without major incidents, respecting the work schedule and using the working time fully and with maximum efficiency for the fulfillment of work tasks, maintaining good relations with other employees, concern for order and quality, etc.

 •  Adaptability
 •  Initiative spirit
 •  The ability to understand work procedures
 •  The ability to communicate
 •  The ability to perform tasks
 •  The ability to solve some problems
 •  Ability to perform simple mathematical calculations
 •  Ability to work independently
 •  The ability to work in a team
 •  Skills in using tools and equipment
 •  Efficient use of materials
 •  Efficient use of working time
 •  Respect for the law
 •  Respect for the hierarchical boss
 •  Respect for colleagues
 •  Respect for the interests of society
 •  Compliance with applicable regulations and decisions
 •  Special skills
 •  Taking responsibility
 •  Intellectual/physical effort

 
 G. Working conditions:
1. The activity is carried out in accordance with the provisions of Law no. 31/1991.
2. The activity provided is carried out under normal/special/special working conditions, according to Law no. 263/2010 regarding the unitary system of public pensions, with subsequent amendments and additions
    



]H. Duration of work:
1. A full-time job, the duration of the working time being 8 hours/day, 40 hours/week.
a). The distribution of the work schedule is as follows, 8 (day hours/night hours/uneven);
b). The work schedule can be changed under the conditions of the applicable internal regulation/collective labor contract.
2. Part-time __ hours/day, __ hours/week.
- The work schedule is distributed as follows: __ (day hours/night hours/uneven);
- The work schedule can be changed under the conditions described in the Internal Regulations/Applicable Collective Labor Agreement.
Overtime will not be carried out, except in cases of force majeure or for other urgent works, intended to prevent the occurrence of accidents or eliminate their consequences.

         
I. Leave
The duration of annual leave is 21 working days, in relation to the duration of work (full-time, part-time).

     

J. Salary
1. Basic monthly gross salary: {cimApplicant.grosssalary} RON and net salary is {cimApplicant.netsalary} RON.
2. Other components:
a). increments -;
b). allowances ----;
b1). additional benefits in money ----;
b2). the method of additional benefits in kind ----;
c). other additions:-------;
 Overtime hours worked outside normal working hours or on non-working days, or on public holidays, are compensated with paid time off, or are paid with a salary increase, according to the applicable collective labor agreement, or the Law no. 53/2003 – Labor Code;

3. The date/dates on which the salary is paid is 01 OF THE FOLLOWING MONTH;

        
K. Rights and obligations of the parties regarding occupational health and safety:
a). personal protective equipment ----;
b). individual work equipment -----;
c). Hygienic-sanitary materials ----;
d). power supply -----;
e). other rights and obligations regarding occupational health and safety ------

       

L. Other Clauses:

a). the trial period is 90 calendar days;

b). the notice period in case of dismissal is 20 working days, according to Law no. 53/2003 - Labor Code, with subsequent amendments and additions or the applicable Collective Labor Agreement;

c). the notice period in case of resignation is 20 working days, according to Law no. 53/2003 - Labor Code, with subsequent amendments and additions or the applicable Collective Labor Agreement;

d). in case the employee is going to carry out his activity abroad, the information provided in art. 18 paragraph (1) of Law no. 53/2003 - The Labor Code, with subsequent amendments and additions, will also be found in the individual employment contract;

e). other clauses - Confidentiality clause in the field of personal data protection:


       
M. General rights and obligations of the parties:

1. The employee mainly has the following rights:
a) the right to pay for the work done;
b) the right to daily and weekly rest;
c) the right to annual leave;
d) the right to equal opportunities and treatment;
e) the right to safety and health at work;
f) the right to access professional training;
g) the right to accommodation leave with a maximum duration of one year (in the case of the adoption procedure) - according to the provisions of the Labor Code (with subsequent amendments and additions).

2. The employee mainly has the following obligations:

a) the obligation to fulfill the work norm or, as the case may be, to fulfill the duties assigned to him according to the job description;
b) the obligation to respect labor discipline;
c) the obligation of loyalty to the employer in the performance of the duties;
d) the obligation to comply with occupational health and safety measures in the unit;
e) the obligation to respect professional secrecy.

3. The employer mainly has the following rights:

a) to give binding provisions for the employee, subject to their legality;
b) to exercise control over the way of performing the duties;
c) to ascertain the commission of disciplinary violations and apply the appropriate sanctions, according to the law, the applicable collective labor agreement and the internal regulations.
d) to establish the individual performance objectives of the employee;

4. The employer mainly has the following obligations:

a) to hand the employee a copy of the individual employment contract, prior to the start of the activity;
a1) to grant the employee all the rights arising from the individual employment contracts, from the applicable collective employment contract and from the law;

b) to permanently ensure the technical and organizational conditions taken into account when developing the work rules and the corresponding work conditions;

c) to inform the employee about the working conditions and about the elements that concern the development of labor relations;
c1) to inform the employee about the obligation to join a privately managed pension fund;.

d) to issue, upon request, a document certifying the applicant's status as an employee, respectively the activity carried out by him, the duration of the activity, the salary, the seniority in the work, in the profession and specialty;

e) to ensure the confidentiality of the employee's personal data;

      
N. Final provisions
The provisions of this individual employment contract are supplemented by the provisions of Law no. 53/2003 - The Labor Code, with subsequent amendments and additions, and of the applicable collective labor agreement concluded at the level of the employer/group of employers/branches/national, registered under no. ---/---- at the Territorial Labor Inspectorate of the county/municipality ---/Ministry of Labor and Social Solidarity.
Any change regarding the contractual clauses during the execution of the individual employment contract requires the conclusion of an additional act to the contract, according to the legal provisions, except for situations where such a change is expressly provided for by law.
This individual employment contract has been concluded in two copies, one for each party.

     
O. Conflicts in relation to the conclusion, execution, modification, suspension or termination of this individual employment contract are resolved by the materially and territorially competent court, according to the law.

This individual employment contract was concluded in two copies, one for each party. 



               Employer,
{OFFERCOMPANY.NAME}..
Legal Representative,
{OFFERCOMPANY.DIRECTORNAME}
	





          Employee, 
{CIMAPPLICANT.NAME} 

  .........................................
I received a counterpart upon concluding the contract.


On the date of ………. this contract terminates pursuant to art... of law no. 53/2003 – Labor Code, following the fulfillment of the legal procedure.


Employer                                   Employee
...........................                       .......................	`;

const employmentRoTemplate = `CONTRACT INDIVIDUAL DE MUNCA 
Incheiat si inregistrat sub nr. ..... ....
in Registrul general de evidenta a salariatilor
  
A. Partile contractului:
Angajator - Persoana juridică    {OFFERCOMPANY.NAME}. , cu sediul   {offercompany.address}, înregistrată la Registrul Comerţului sub numărul     {OFFERCOMPANY.TRADEREGNO} , cod fiscal {offercompany.cui}, reprezentată legal  {OFFERCOMPANY.DIRECTORNAME}, în calitate de Administrator.
     
 Şi

Salariatul –{cimApplicant.romaniantitle}. {CIMAPPLICANT.NAME}, cetatean din {cimApplicant.country}, nascut la data de {cimApplicant.dob}, in   {CIMAPPLICANT.BIRTHPLACE} , {cimApplicant.country}, posesor al pasaportului numarul  {CIMAPPLICANT.PASSPORT}, eliberat de autoritatile din {cimApplicant.passportissuedby} la {cimApplicant.issuedate}, valabil pana la data de {cimApplicant.expirydate}, autorizatie de munca nr. {cimApplicant.workpermitno} din data {cimApplicant.workpermitdate} si CNP {cimApplicant.cnp}.

am încheiat prezentul contract individual de muncă în următoarele condiţii asupra cărora am convenit:

      
B. Obiectul Contractului:
Prestarea de către salariat a muncii corespunzătoare funcţiei, pentru și sub autoritatea angajatorului, în condiţiile convenite prin prezentul contract.

    
C. Durata Contractului:
 Nedeterminata- salariatul     {CIMAPPLICANT.NAME} , urmând să înceapă activitatea la data sosirii in Romania.

       
      
 D. Locul de munca: 
    
1. Activitatea se desfasoara la punct de lucru.
  2. În lipsa unui loc de muncă fix salariatul va desfășura activitatea astfel:
........ (pe teren / la sediul clienților / arie geografică ..........., grup de unități, etc.). În acest caz salariatul va beneficia de: ...... .
 a) prestații suplimentare .......-...... (în bani sau în natură);
 b) asigurarea /decontarea transportului de către angajator .......-......... (după caz) .
    

 
 E. Felul muncii
Funcţia/ocupatia –    {cimApplicant.jobtitle} - Cod COR {cimApplicant.corcode} conform Clasificării Ocupaţiilor din România.

  
F. Atributiile postului
Atribuțiile postului sunt prevăzute în fișa postului, anexă la contractul individual de muncă.

    
F1. Criteriile de evaluare a activității profesionale a salariatului:
Criteriile de evaluare sunt mentionate in fișa postului, anexă la contractul individual de muncă.
- indeplinirea sarcinilor de serviciu fara incidente majore, respectarea programului de lucru si utilizarea integrala si cu maxima eficienta a timpului de lucru pentru indeplinirea sarcinilor de serviciu, mentinerea buna a relatiilor cu ceilalti salariati, preocuparea pentru ordine si calitate, etc.

    •  Adaptabilitate
    •  Spirit de iniţiativă
    •  Capacitatea de a intelege  procedee de lucru
    •  Capacitatea de a comunica
    •  Capacitatea de a indeplini sarcinile
    •  Capacitatea de rezolvare a unor probleme
    •  Capacitatea de a efectua calcule matematice simple
    •  Capacitatea de a lucra independent
    •  Capacitatea de a lucra în echipă
    • Abilitati în utilizarea uneltelor si echipamentelor
    •  Utilizarea eficienta a materialelor
    •  Utilizarea eficienta a timpului de muncă
    •  Respectul faţă de lege
    •  Respectul faţă de şeful ierarhic
    •  Respectul fata de colegi
    •  Respectul faţă de interesele societatii
    • Respectarea regulamentelor şi deciziilor aplicabile
    •  Aptitudini deosebite
    •  Asumarea responsabilitatilor
    •  Efort intelectual/fizic


    G. Condiţii de muncă:
1. Activitatea se desfăşoară în conformitate cu prevederile Legii nr. 31/1991.
2.Activitatea prestată se desfăşoară în condiţii normale/deosebite/speciale de muncă, potrivit Legii nr. 263/2010 privind sistemul unitar de pensii publice, cu modificările şi completările ulterioare


H. Durata muncii:
1.  O normă intreaga, durata timpului de lucru fiind de 8 ore /zi, 40 ore/săptămână.
a). Repartizarea programului de lucru se face după cum urmează, 8 (ore de zi/ore noapte/inegal); 
b). Programul de lucru se poate modifica în condiţiile regulamentului intern/contractului colectiv de muncă aplicabil.
2. O fracțiune de normă de __ ore/zi, __ ore/săptămână. 
   -   Repartizarea programului de lucru se face după cum urmează: __ (ore zi/ore noapte/inegal); 
   -  Programul de lucru se poate modifica în condițiile descrise în Regulamentul Intern/Contractul colectiv de muncă aplicabil. 
Nu se vor efectua ore suplimentare, cu excepția cazurilor de forță majoră sau pentru alte lucrări urgente, destinate prevenirii producerii unor accidente sau înlăturării consecințelor acestora.

       
I. Concediul
Durata concediului anual de odihnă este de 21 zile lucrătoare, în raport cu durata muncii (normă întreagă, fracţiune de normă).

       
J. Salarizare:
1. Salariul de bază lunar brut: {cimApplicant.grosssalary} RON  si net salariul de  {cimApplicant.netsalary} RON.
2. Alte elemente constitutive:
a). sporuri -;
b). indemnizaţii ----;
b1). prestații suplimentare in bani ----;
b2). modalitatea prestațiilor suplimentare in natura ----;
c). alte adaosuri :-------;
        Orele suplimentare prestate în afara programului normal de lucru sau în zilele în care nu se      lucrează, ori în zilele de sărbători legale, se compensează cu ore libere plătite, sau se plătesc cu un spor la salariu, conform contractului colectiv de muncă aplicabil, sau Legii nr. 53/2003 – Codul Muncii; 
  
3. Data/datele la care se plăteşte salariul este 01 ALE LUNII URMATOARE;


       K. Drepturi şi obligaţii ale părţilor privind sănătatea şi securitatea în muncă:
a). echipament individual de protecţie ----;
b). echipament individual de lucru -----;
c). Materiale igienico-sanitare ----;
d). alimentaţie de protecţie -----;
e). alte drepturi şi obligaţii privind sănătatea şi securitatea în muncă ------

      
L. Alte clauze:  

a). perioada de proba este de 90 zile calendaristice;

b). perioada de preaviz în cazul concedierii este de 20 zile lucrătoare, conform Legii nr. 53/2003 - Codul Muncii, cu modificările si completările ulterioare sau Contractului colectiv de muncă aplicabil;

c). perioada de preaviz în cazul demisiei este de 20 zile lucrătoare, conform Legii nr. 53/2003 - Codul Muncii, cu modificările si completările ulterioare sau Contractului colectiv de muncă aplicabil;

d). în cazul în care salariatul urmează să-şi desfăşoare activitatea în străinătate, informaţiile prevăzute la art.18 alin.(1) din Legea nr. 53/2003 - Codul muncii, cu modificările si completările ulterioare, se vor regăsi şi în contractul individual de muncă;

e). alte clauze -  Clauză de confidențialitate în domeniul protecției datelor cu caracter personal:


       
M. Drepturi şi obligaţii generale ale părţilor: 

1. Salariatul are, în principal, următoarele drepturi:
a) dreptul la salarizare pentru munca depusă;
b) dreptul la repaus zilnic şi săptămânal;
c) dreptul la concediu de odihnă anual;
d) dreptul la egalitate de şanse şi de tratament;
e) dreptul la securitate şi sănătate în muncă;
f) dreptul la acces la formare profesională;
g) dreptul la concediu de acomodare cu durata de maximum un an (in cazul procedurii adoptiei) – conform prevederilor Codului Muncii (cu modificarile si completarile ulterioare).

2. Salariatului îi revin, în principal, următoarele obligaţii:

a) obligaţia de a realiza norma de muncă sau, după caz, de a îndeplini atribuţiile ce îi revin conform fişei postului;
b) obligaţia de a respecta disciplina muncii;
c) obligaţia de fidelitate faţă de angajator în executarea atribuţiilor de serviciu;
d) obligaţia de a respecta măsurile de securitate şi sănătate a muncii în unitate;
e) obligaţia de a respecta secretul de serviciu.

3. Angajatorul are, în principal, următoarele drepturi:

a) să dea dispoziţii cu caracter obligatoriu pentru salariat, sub rezerva legalităţii lor;
b) să exercite controlul asupra modului de îndeplinire a sarcinilor de serviciu;
c) să constate săvârşirea abaterilor disciplinare şi să aplice sancţiunile corespunzătoare, potrivit legii, contractului colectiv de muncă aplicabil şi regulamentului intern.
d) sa stabilească obiectivele de performanta individuala a salariatului;

4. Angajatorului în revin, în principal, următoarele obligaţii:

a) să înmâneze salariatului un exemplar din contractul individual de muncă, anterior începerii activitatii;
a1) să acorde salariatului toate drepturile ce decurg din contractele individuale de muncă, din contractul colectiv de muncă aplicabil şi din lege;

b) să asigure permanent condiţiile tehnice şi organizatorice avute în vedere la elaborarea normelor de muncă şi condiţiile corespunzătoare de muncă;

c) să informeze salariatul asupra condiţiilor de muncă şi asupra elementelor care privesc desfăşurarea relaţiilor de muncă;
c1) să informeze angajatul cu privire la obligația de a adera la un fond de pensii administrat privat;.

d) să elibereze, la cerere, un document care sa ateste calitatea de salariat a solicitantului, respectiv activitatea desfasurata de acesta, durata activitatii, salariul, vechimea in munca, in meserie si specialitate;

e) să asigure confidenţialitatea datelor cu caracter personal ale salariatului;

     
N. Dispoziţii finale
Prevederile prezentului contract individual de muncă se completează cu dispoziţiile Legii nr. 53/2003 - Codul Muncii, cu modificările si completările ulterioare, şi ale contractului colectiv de muncă aplicabil încheiat la nivelul angajatorului/grupului de angajatori/ramurii/naţional, înregistrat sub nr. ---/---- la Inspectoratul Teritorial de Munca a judeţului/municipiului ---/Ministerul Muncii şi Solidarităţii sociale.
Orice modificare privind clauzele contractuale în timpul executării contractului individual de muncă impune încheierea unui act adiţional la contract, conform dispoziţiilor legale, cu excepția situațiilor in care o asemenea modificare este prevăzuta in mod expres de lege.
Prezentul contract individual de muncă s-a încheiat în două exemplare, câte unul pentru fiecare parte.



    
O. Conflictele în legătură cu încheierea, executarea, modificarea, suspendarea sau încetarea prezentului contract individual de muncă sunt soluţionate de către instanţa judecătorească competentă material şi teritorial, potrivit legii.



Prezentul contract individual de munca s-a incheiat in doua exemplare, cate unul pentru fiecare parte.


           Angajator,
   {OFFERCOMPANY.NAME}.
Reprezentant legal,
    {OFFERCOMPANY.DIRECTORNAME} 	







             Salariat,
{CIMAPPLICANT.NAME} 

...............................

La incheierea contractului am primit un exampler.



Pe data de ………. prezentul contract inceteaza in temeiul art……… din legea nr. 53/2003 – Codul muncii, in urma indeplinirii procedurii legale.
.

Angajator,                                Salariat,
........................                  .................................`;

const guaranteeTemplate = `{OFFERCOMPANY.NAME}.
Unique Regd. Code: {offercompany.cui}, Trade Register No: {OFFERCOMPANY.TRADEREGNO}
{offercompany.address}
Email : {offercompany.email}, Tel {offercompany.contact}

                                                                                             Nr. Inregistrare: {cimapplicant.gCode} /{cimapplicant.gdate}
                                               	 
                                
                                                         SCRISOARE DE GARANTIE, 





 AMBASADA ROMANIEI IN NEW DELHI, 

              Subscrisa {OFFERCOMPANY.NAME}., cu domicilul în {offercompany.address}, inregistrată la Registrul Comerţului sub numărul {OFFERCOMPANY.TRADEREGNO}, cod fiscal {offercompany.cui}, reprezentată legal {OFFERCOMPANY.DIRECTORNAME}, solicita sprijinul pentru obtinerea vizei romane de lunga sedere in scop de munca pentru domnul/doamna {CIMAPPLICANT.NAME}, cetatean din {cimApplicant.country}, nascut la data de {cimApplicant.dob}, in  {CIMAPPLICANT.BIRTHPLACE}, {cimApplicant.country}, posesor al pasaportului numarul {CIMAPPLICANT.PASSPORT}, eliberat de autoritatile din {cimApplicant.passportissuedby} la {cimApplicant.issuedate}, valabil pana la data de {cimApplicant.expirydate}.

              Domnul/Doamna {CIMAPPLICANT.NAME} va fi angajat/a in cadrul compania noastra cu contract individual de munca pe o perioada de nedeterminata, pe functia de {cimApplicant.jobtitle} (cod COR {cimApplicant.corcode}) conform avizului de munca nr. {cimApplicant.workpermitno} din data {cimApplicant.workpermitdate}  si CNP {cimApplicant.cnp}.

De asemenea, in baza contractului de munca, vor fi asigurate urmatoarele:
-	Cazare gratuit la adresa din {cimapplicant.accommodationaddress}. 
-	Asigurare medicala si asigurare sociala.
-	Hrana zilnica sau bonuri de masa.


                 Mentionam ca salariul de baza al numitului/numitei {CIMAPPLICANT.NAME} va fi de {cimApplicant.grosssalary} Lei/luna si net salariul de {cimApplicant.netsalary} RON/luna. 

 



 Reprezentant legal 	
IONUT POPA`;

const comodatTemplate = `{OFFERCOMPANY.NAME}.
Unique Regd. Code: {offercompany.cui}, Trade Register No: {OFFERCOMPANY.TRADEREGNO}
{offercompany.address}
Email : {offercompany.email}, Tel {offercompany.contact}



                                                                    CONTRACT DE COMODAT   
                                    NR. {cimapplicant.comCode} DIN DATA DE  {cimapplicant.comdate} 

 I.	PARTILE CONTRACTANRTE

{OFFERCOMPANY.NAME}., cu domicilul {offercompany.address},  înregistrată la Registrul Comerţului sub numărul {OFFERCOMPANY.TRADEREGNO}, cod fiscal {offercompany.cui}, reprezentată legal {OFFERCOMPANY.DIRECTORNAME} in calitate de COMODANT,  

Și  

{CIMAPPLICANT.NAME}, cetatean din {cimApplicant.country}, nascut la data de {cimApplicant.dob}, in  {CIMAPPLICANT.BIRTHPLACE}, {cimApplicant.country}, posesor al pasaportului numarul {CIMAPPLICANT.PASSPORT}, eliberat de autoritatile din {cimApplicant.passportissuedby} la {cimApplicant.issuedate}, valabil pana la data de {cimApplicant.expirydate}, in calitate de COMODATAR, au convenit sa încheie prezentul contract de comodat cu respectarea următoarelor clauze:  

II.	OBIECTUL CONTRACTULUI

Comodantul pune la dispoziția Comodatarului, cu titlu de împrumut de folosință gratuit, un loc într-un imobil in {cimapplicant.accommodationaddress}.
Spațiul ce face obiectul prezentului contract urmează a fi folosit de către Comodatar în vederea locuirii, în condițiile expres convenite de către părți in cuprinsul prezentului contract de comodat.  

III.	OBLIGATIILE PARTILOR

1.Obligatiile comodatarului sunt următoarele:  

a)	să îngrijească si sa conserve locuința ca bun proprietar,  

b)	sa folosească locuința conform destinației sale, determinate prin natura sa  

c) răspunde daca locuința se deteriorează din vina sa  

2. Obligațiile comodantului sunt următoarele:  

a)	să predea spre folosința comodatarului camera din imobilul mai sus menționat;  

b)	să răspundă de repararea daunelor cauzate de viciile ascunse ale locuinței;

IV.	INCETAREA CONTRACTULUI  

2.	Prezentul contract încetează de plin drept, fără a mai fi necesara intervenția unui/unei  
Tribunal arbitral/Instanțe Judecătorești, în cazul in care una dintre părți nu își respecta atribuțiile prevăzute conform legii.  

3.	Partea care invoca o cauza de încetare a prevederilor prezentului contract o va notifica pe cealaltă parte cu cel puțin 2 zile înainte de data la care încetarea urmează să producă efecte;  

4.	Rezilierea prezentului contract nu va avea nici un efect asupra obligațiilor deja scadente intre părțile contractante.

V.	CLAUZE FINALE
    

1.	Modificarea prezentului contract se face numai prin act adițional încheiat intre părțile contractante.  

2.	Prezentul contract, împreună cu anexele sale fac parte integranta din cuprinsul sau, reprezintă voința părților și înlătura orice alta înțelegere verbala dintre aceștia anterioara sau ulterioara încheierii lui.  

3.	În cazul in care părțile își încalcă obligațiile lor, neexercitarea de partea care suferă vreun prejudiciu a dreptului de a cere executarea întocmai sau prin echivalent bănesc a obligației respective nu înseamnă că ea a renunțat la acest drept al sau.    

4.	Încheiat astăzi {cimapplicant.comdate}, conform art. 1560 din Cod Civil în 2 exemplare originale pentru fiecare parte.  


COMODANT                                                                     COMODATAR
{OFFERCOMPANY.NAME}.			       {CIMAPPLICANT.NAME}
 Administrator
{OFFERCOMPANY.DIRECTORNAME},



`;












// ======== HELPER: RENDER TEMPLATE WITH BOLD VALUES ========

const renderTemplateWithBold = (template, replacements) => {
  let nodes = [template];

  Object.entries(replacements).forEach(([token, value]) => {
    const v = value ?? "";
    if (!token || v === "") return;

    const nextNodes = [];
    nodes.forEach((node) => {
      if (typeof node === "string") {
        const parts = node.split(token);
        if (parts.length === 1) {
          nextNodes.push(node);
        } else {
          parts.forEach((part, index) => {
            if (part) nextNodes.push(part);
            if (index < parts.length - 1) {
              nextNodes.push(<strong key={token + "-" + index}>{v}</strong>);
            }
          });
        }
      } else {
        nextNodes.push(node);
      }
    });
    nodes = nextNodes;
  });

  return nodes;
};

const GenerateContract = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [gender, setGender] = useState("male");
  const [stampPreview, setStampPreview] = useState(null);
  const [generated, setGenerated] = useState(false);

  const [form, setForm] = useState({
    fullname: "",
    country: "",
    dob: "",
    birthplace: "",
    passport: "",
    passportIssuedBy: "",
    issueDate: "",
    expiryDate: "",
    workPermitNo: "",
    workPermitDate: "",
    cnp: "",
    jobTitle: "",
    corCode: "",
    grossSalary: 4050,
    netSalary: 2574,
    accommodationAddress: "",
    comDate: "",
    comCode: "",
    gCode: "",
    gDate: "",
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get("/offers/companies");
        setCompanies(res.data);
      } catch (err) {
        console.error(err);
        alert("Error loading companies");
      }
    };
    fetchCompanies();
  }, []);

  const selectedCompany = useMemo(
    () => companies.find((c) => c._id === selectedCompanyId),
    [companies, selectedCompanyId]
  );

  const englishTitle = gender === "male" ? "MR" : "MS/MRS";
  const romanianTitle = gender === "male" ? "Domnul" : "Doamna";

  const replacements = useMemo(() => {
    if (!selectedCompany) return null;
    return {
      "{OFFERCOMPANY.NAME}": selectedCompany.name,
      "{offercompany.address}": selectedCompany.address,
      "{OFFERCOMPANY.TRADEREGNO}": selectedCompany.traderegno,
      "{offercompany.cui}": selectedCompany.cui,
      "{OFFERCOMPANY.DIRECTORNAME}": selectedCompany.representative,
      "{offercompany.email}": selectedCompany.email,
      "{offercompany.contact}": selectedCompany.contact,

      "{cimApplicant.englishtitle}": englishTitle,
      "{cimApplicant.romaniantitle}": romanianTitle,

      "{CIMAPPLICANT.NAME}": form.fullname,
      "{cimApplicant.country}": form.country,
      "{cimApplicant.dob}": form.dob,
      "{CIMAPPLICANT.BIRTHPLACE}": form.birthplace,
      "{CIMAPPLICANT.PASSPORT}": form.passport,
      "{cimApplicant.passportissuedby}": form.passportIssuedBy,
      "{cimApplicant.issuedate}": form.issueDate,
      "{cimApplicant.expirydate}": form.expiryDate,
      "{cimApplicant.workpermitno}": form.workPermitNo,
      "{cimApplicant.workpermitdate}": form.workPermitDate,
      "{cimApplicant.cnp}": form.cnp,
      "{cimApplicant.jobtitle}": form.jobTitle,
      "{cimApplicant.corcode}": form.corCode,
      "{cimApplicant.grosssalary}": String(form.grossSalary),
      "{cimApplicant.netsalary}": String(form.netSalary),
      "{cimapplicant.accommodationaddress}": form.accommodationAddress,
      "{cimapplicant.comdate}": form.comDate,
      "{cimapplicant.comCode}": form.comCode,
      "{cimapplicant.gCode}": form.gCode,
      "{cimapplicant.gdate}": form.gDate,
    };
  }, [selectedCompany, englishTitle, romanianTitle, form]);

  const employmentEnNodes = useMemo(
    () =>
      replacements
        ? renderTemplateWithBold(employmentEnTemplate, replacements)
        : [],
    [replacements]
  );
  const employmentRoNodes = useMemo(
    () =>
      replacements
        ? renderTemplateWithBold(employmentRoTemplate, replacements)
        : [],
    [replacements]
  );
  const guaranteeNodes = useMemo(
    () =>
      replacements
        ? renderTemplateWithBold(guaranteeTemplate, replacements)
        : [],
    [replacements]
  );
  const comodatNodes = useMemo(
    () =>
      replacements ? renderTemplateWithBold(comodatTemplate, replacements) : [],
    [replacements]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStampChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setStampPreview(url);
  };

  const handleGenerate = () => {
    if (!selectedCompany) {
      alert("Select a company first.");
      return;
    }
    if (!form.fullname) {
      alert("Enter applicant full name.");
      return;
    }
    setGenerated(true);
  };

  const handlePrint = () => {
    if (!generated) {
      alert("Generate the contract first.");
      return;
    }
    window.print();
  };

  return (
    <>
      {/* PRINT & PREVIEW STYLES */}
      <style>
        {`
        @media print {
          body {
            background: #fff !important;
          }
          .no-print {
            display: none !important;
          }
          .cim-print-page {
            width: 210mm;
            margin: 0 auto;
            padding: 15mm 15mm;
            background: white;
            font-size: 11pt;
            line-height: 1.35;
            font-family: "Times New Roman", Times, serif;
          }
          .cim-table {
            width: 100%;
            border-collapse: collapse;
          }
          .cim-table td {
            width: 50%;
            border: 1px solid #000;
            vertical-align: top;
            padding: 6pt 8pt;
          }
          .cim-section {
            position: relative;
            margin-bottom: 18pt;
          }
          .cim-section-guarantee {
            page-break-before: always;
          }
          .cim-section-comodat {
            page-break-before: always;
          }
          .cim-text {
            white-space: pre-wrap;
          }

          /* Stamps */
          .cim-stamp-employment-en,
          .cim-stamp-employment-ro,
          .cim-stamp-guarantee,
          .cim-stamp-comodat {
            position: absolute;
            width: 120px;
            opacity: 0.9;
          }

          /* Employment contract stamps – near director names in both columns */
          .cim-stamp-employment-en {
            left: 25mm;   /* inside left column */
            bottom: 25mm; /* up from bottom so it overlaps around "Legal Representative" */
          }
          .cim-stamp-employment-ro {
            left: 125mm;  /* inside right column */
            bottom: 25mm;
          }

          /* Guarantee stamp – near "Reprezentant legal" line at bottom */
          .cim-stamp-guarantee{
            left: 15mm;
            bottom: 1005mm;
          }

          /* Comodat stamp – near COMODANT signature area at end */
          .cim-stamp-comodat {
            left: 30mm;
            bottom: 25mm;
          }
        }

        /* Screen preview */
        .cim-print-page {
          width: 210mm;
          margin: 20px auto;
          padding: 15mm 15mm;
          background: white;
          font-size: 11pt;
          line-height: 1.35;
          font-family: "Times New Roman", Times, serif;
          box-shadow: 0 0 10px rgba(0,0,0,0.15);
        }
        .cim-table {
          width: 100%;
          border-collapse: collapse;
        }
        .cim-table td {
          width: 50%;
          border: 1px solid #000;
          vertical-align: top;
          padding: 6pt 8pt;
        }
        .cim-section {
          position: relative;
          margin-bottom: 18pt;
        }
        .cim-text {
          white-space: pre-wrap;
        }

        .cim-stamp-employment-en,
        .cim-stamp-employment-ro,
        .cim-stamp-guarantee,
        .cim-stamp-comodat {
          position: absolute;
          width: 120px;
          opacity: 0.9;
        }
        .cim-stamp-employment-en {
          left: 25mm;
          bottom: 105mm;
        }
        .cim-stamp-employment-ro {
          left: 125mm;
          bottom: 95mm;
        }
        .cim-stamp-guarantee{
          left: 20mm;
          bottom: -25mm;
        }
        .cim-stamp-comodat {
          left: 15mm;
          bottom: -15mm;
        }
        `}
      </style>

      <div className="min-h-screen bg-slate-100">
        {/* FORM UI (hidden on print) */}
        <div className="no-print">
          <TopStrip />
          <SecondStrip />

          <div className="max-w-6xl mx-auto py-6 px-4">
            <h1 className="text-2xl font-semibold mb-4">
              Generate CIM Contract
            </h1>

            {/* Company selection */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <h2 className="font-semibold mb-3 text-sm">Select Company</h2>
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
              >
                <option value="">-- Choose company --</option>
                {companies.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {selectedCompany && (
                <div className="mt-4 text-xs text-slate-600 space-y-1">
                  <div>
                    <strong>Address:</strong> {selectedCompany.address}
                  </div>
                  <div>
                    <strong>CUI:</strong> {selectedCompany.cui}
                  </div>
                  <div>
                    <strong>Trade Reg No:</strong> {selectedCompany.traderegno}
                  </div>
                  <div>
                    <strong>Email:</strong> {selectedCompany.email}
                  </div>
                  <div>
                    <strong>Contact:</strong> {selectedCompany.contact}
                  </div>
                  <div>
                    <strong>Director:</strong> {selectedCompany.representative}
                  </div>
                </div>
              )}
            </div>

            {/* Applicant & contract details */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <h2 className="font-semibold mb-3 text-sm">
                Applicant & Contract Details
              </h2>

              {/* Gender / Title */}
              <div className="mb-4 flex items-center gap-4 text-sm">
                <span className="font-medium">Gender / Title:</span>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    value="male"
                    checked={gender === "male"}
                    onChange={() => setGender("male")}
                  />
                  <span>Male (MR / Domnul)</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    value="female"
                    checked={gender === "female"}
                    onChange={() => setGender("female")}
                  />
                  <span>Female (MS/MRS / Doamna)</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <input
                  name="fullname"
                  value={form.fullname}
                  onChange={handleChange}
                  placeholder="Full name"
                  className="border rounded-md px-3 py-2"
                />
                <input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Country"
                  className="border rounded-md px-3 py-2"
                />
                <input
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  placeholder="Date of birth (text)"
                  className="border rounded-md px-3 py-2"
                />
                <input
                  name="birthplace"
                  value={form.birthplace}
                  onChange={handleChange}
                  placeholder="Birthplace"
                  className="border rounded-md px-3 py-2"
                />
                <input
                  name="passport"
                  value={form.passport}
                  onChange={handleChange}
                  placeholder="Passport number"
                  className="border rounded-md px-3 py-2"
                />
                <input
                  name="passportIssuedBy"
                  value={form.passportIssuedBy}
                  onChange={handleChange}
                  placeholder="Passport issued by"
                  className="border rounded-md px-3 py-2"
                />
                <input
                  name="issueDate"
                  value={form.issueDate}
                  onChange={handleChange}
                  placeholder="Issue date"
                  className="border rounded-md px-3 py-2"
                />
                <input
                  name="expiryDate"
                  value={form.expiryDate}
                  onChange={handleChange}
                  placeholder="Expiry date"
                  className="border rounded-md px-3 py-2"
                />
                <input
                  name="workPermitNo"
                  value={form.workPermitNo}
                  onChange={handleChange}
                  placeholder="Work permit no."
                  className="border rounded-md px-3 py-2"
                />
                <input
                  name="workPermitDate"
                  value={form.workPermitDate}
                  onChange={handleChange}
                  placeholder="Work permit date"
                  className="border rounded-md px-3 py-2"
                />
                <input
                  name="cnp"
                  value={form.cnp}
                  onChange={handleChange}
                  placeholder="CNP"
                  className="border rounded-md px-3 py-2"
                />
                <input
                  name="jobTitle"
                  value={form.jobTitle}
                  onChange={handleChange}
                  placeholder="Job title"
                  className="border rounded-md px-3 py-2"
                />
                <input
                  name="corCode"
                  value={form.corCode}
                  onChange={handleChange}
                  placeholder="COR code"
                  className="border rounded-md px-3 py-2"
                />
                <input
                  type="number"
                  name="grossSalary"
                  value={form.grossSalary}
                  onChange={handleChange}
                  placeholder="Gross salary (RON)"
                  className="border rounded-md px-3 py-2"
                />
                <input
                  type="number"
                  name="netSalary"
                  value={form.netSalary}
                  onChange={handleChange}
                  placeholder="Net salary (RON)"
                  className="border rounded-md px-3 py-2"
                />
                <input
                  name="accommodationAddress"
                  value={form.accommodationAddress}
                  onChange={handleChange}
                  placeholder="Accommodation address"
                  className="border rounded-md px-3 py-2 md:col-span-3"
                />
                <input
                  name="comDate"
                  value={form.comDate}
                  onChange={handleChange}
                  placeholder="Comodat date"
                  className="border rounded-md px-3 py-2"
                />
                <input
                  name="comCode"
                  value={form.comCode}
                  onChange={handleChange}
                  placeholder="Comodat code"
                  className="border rounded-md px-3 py-2"
                />
                <input
                  name="gCode"
                  value={form.gCode}
                  onChange={handleChange}
                  placeholder="Guarantee letter code"
                  className="border rounded-md px-3 py-2"
                />
                <input
                  name="gDate"
                  value={form.gDate}
                  onChange={handleChange}
                  placeholder="Guarantee letter date"
                  className="border rounded-md px-3 py-2"
                />
              </div>
            </div>

            {/* Stamp uploader */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <h2 className="font-semibold mb-3 text-sm">
                Upload Company Stamp
              </h2>
              <input
                type="file"
                accept="image/*"
                onChange={handleStampChange}
                className="text-sm"
              />
              {stampPreview && (
                <div className="mt-3">
                  <p className="text-xs text-slate-500 mb-1">
                    Preview (will appear on company signature places).
                  </p>
                  <img
                    src={stampPreview}
                    alt="Stamp"
                    className="h-20 object-contain border rounded bg-white"
                  />
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 mb-4">
              <button
                type="button"
                onClick={handleGenerate}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Generate Contract
              </button>
              <button
                type="button"
                onClick={handlePrint}
                disabled={!generated}
                className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm bg-white"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          </div>
        </div>

        {/* PRINT / PREVIEW CONTENT */}
        {generated && replacements && (
          <div className="cim-print-page">
            {/* EMPLOYMENT CONTRACT (bilingual) */}
            <div className="cim-section cim-section-employment">
              <table className="cim-table">
                <tbody>
                  <tr>
                    <td>
                      <div className="cim-text">{employmentEnNodes}</div>
                    </td>
                    <td>
                      <div className="cim-text">{employmentRoNodes}</div>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Two stamps: English side + Romanian side */}
              {stampPreview && (
                <>
                  <img
                    src={stampPreview}
                    alt="Stamp"
                    className="cim-stamp-employment-en"
                  />
                  <img
                    src={stampPreview}
                    alt="Stamp"
                    className="cim-stamp-employment-ro"
                  />
                </>
              )}
            </div>

            {/* GUARANTEE LETTER (new page) */}
            <div className="cim-section cim-section-guarantee">
              <div className="cim-text">{guaranteeNodes}</div>
              {stampPreview && (
                <img
                  src={stampPreview}
                  alt="Stamp"
                  className="cim-stamp-guarantee"
                />
              )}
            </div>

            {/* COMODAT CONTRACT (new page) */}
            <div className="cim-section cim-section-comodat">
              <div className="cim-text">{comodatNodes}</div>
              {stampPreview && (
                <img
                  src={stampPreview}
                  alt="Stamp"
                  className="cim-stamp-comodat"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GenerateContract;
