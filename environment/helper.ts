export function especialCharMask (especialChar: string): any{
    
    especialChar = especialChar.replace('/[áàãâä]/ui', 'a');
    especialChar = especialChar.replace('/[éèêë]/ui', 'e');
    especialChar = especialChar.replace('/[íìîï]/ui', 'i');
    especialChar = especialChar.replace('/[óòõôö]/ui', 'o');
    especialChar = especialChar.replace('/[úùûü]/ui', 'u');
    especialChar = especialChar.replace('/[^a-z0-9]/i', '_');
    especialChar = especialChar.replace('/_+/', '_'); 
    especialChar = especialChar.replace(/[|&;%@"<>()+\t\n]/g, "");
    return especialChar;
}