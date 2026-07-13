import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MCQ {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export default function InteractiveMCQ({ mcq, index }: { mcq: MCQ; index: number }) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const hasAnswered = selectedOption !== null;

  return (
    <View className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm mb-4">
      <View className="p-5">
        <View className="flex-row mb-4 pr-4">
          <Text className="text-[#6B7280] font-semibold text-lg mr-2">{index + 1}.</Text>
          <Text className="font-semibold text-lg text-[#0A2540] flex-1 leading-6">{mcq.question}</Text>
        </View>
        
        <View className="space-y-2 pl-6">
          {mcq.options.map((option, optIdx) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === mcq.answer;
            
            let containerStyles = 'border-gray-200 bg-white';
            let textStyles = 'text-[#6B7280]';
            let circleStyles = 'border-gray-300 bg-white';
            let innerCircle = false;
            
            if (hasAnswered) {
              containerStyles = 'border-gray-200 bg-white opacity-70';
              textStyles = 'text-[#6B7280]';
              
              if (isCorrect) {
                containerStyles = 'border-green-500 bg-green-50';
                textStyles = 'text-green-900 font-medium';
                circleStyles = 'border-green-500 bg-green-500';
                innerCircle = true;
              } else if (isSelected && !isCorrect) {
                containerStyles = 'border-red-500 bg-red-50';
                textStyles = 'text-red-900 font-medium';
                circleStyles = 'border-red-500 bg-red-500';
                innerCircle = true;
              }
            }

            return (
              <TouchableOpacity 
                key={optIdx} 
                onPress={() => !hasAnswered && setSelectedOption(option)}
                disabled={hasAnswered}
                className={`w-full flex-row items-center p-3.5 rounded-xl border ${containerStyles} mb-2`}
              >
                <View className={`w-5 h-5 rounded-full border items-center justify-center mr-3 ${circleStyles}`}>
                  {innerCircle && <View className="w-2 h-2 bg-white rounded-full" />}
                </View>
                <Text className={`flex-1 text-sm leading-5 ${textStyles}`}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        
        {hasAnswered && (
          <View className="mt-4 ml-6 p-4 bg-[#EEF2FF] border border-[#E0E7FF] rounded-xl">
            <View className="flex-row items-center gap-2 mb-2">
              <Ionicons name="information-circle-outline" size={18} color="#3730A3" />
              <Text className="font-bold text-[#3730A3]">Explanation</Text>
            </View>
            <Text className="text-[#3730A3] text-sm leading-5">{mcq.explanation}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
