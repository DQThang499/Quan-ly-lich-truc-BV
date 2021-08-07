import Translate from 'react-jhipster/lib/src/language/translate';
import React from 'react';

export const printSex = (n: number) => (n === 1 ? <Translate contentKey="human.sex.male" /> : <Translate contentKey="human.sex.female" />);

export const printBMIConclusion = (BMI: number) => {
  if (BMI < 15) {
    return <Translate contentKey="bmi_conclusion.lack_of_heavy_weight" />;
  } else if (15 <= BMI && BMI < 16) {
    return <Translate contentKey="bmi_conclusion.lack_of_weight" />;
  } else if (16 <= BMI && BMI < 18.5) {
    return <Translate contentKey="bmi_conclusion.underweight" />;
  } else if (18.5 <= BMI && BMI < 25) {
    return <Translate contentKey="bmi_conclusion.normal" />;
  } else if (25 <= BMI && BMI < 30) {
    return <Translate contentKey="bmi_conclusion.pre_obesity" />;
  } else if (30 <= BMI && BMI < 35) {
    return <Translate contentKey="bmi_conclusion.obesity_degree_i" />;
  } else if (35 <= BMI && BMI < 40) {
    return <Translate contentKey="bmi_conclusion.obesity_degree_ii" />;
  } else {
    return <Translate contentKey="bmi_conclusion.obesity_iii" />;
  }
};
