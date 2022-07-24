package demo.util;

import org.springframework.stereotype.Service;

@Service
public class ProfanityFilter {
	
	String result;
	
	public String getCleanContent(String fullStr) {
		String[] str = fullStr.split(" ");
		
		
		result = "";
		for(int i = 0; i < str.length; i++) {
			if(!isCleanContent(str[i]))
				str[i] = cleanWord(str[i]);
			if(i == str.length - 1) // If it's the last word in the array, don't add a space to it.
				result += str[i];
			else // Else, add a space.
				result += str[i] + " ";
		}
		return result;
		
	}
	
	public boolean isCleanContent(String word) {
		word = word.toLowerCase();
		String[] profanity = {"barnacles", "pineapples", "dragon ball evolution", "avatar the last airbender movie", "bruno", "m night shamalan"};
		
		for (int j = 0; j < profanity.length; j++) {
			if (word.equals(profanity[j]))
				return false;
		}
		return true;
	}
	
	public String cleanWord(String word) {
		return "REDACTED";
	}
}
