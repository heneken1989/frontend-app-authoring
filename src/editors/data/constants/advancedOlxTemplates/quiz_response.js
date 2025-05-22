/* eslint-disable */
// ---
// metadata:
//     display_name: Fill-in-the-blank Quiz
//     markdown: !!null
//     showanswer: never
// data: |
const quizResponse = `<problem>
    <customresponse cfn="check_function">
        <script type="loncapa/python">
<![CDATA[
import json
def check_function(e, ans):
    """
    Check the student's answers against the correct answers.
    The response contains two keys:
    - "answer": JSON string with student answers
    - "state": JSON string with current state
    """
    response = json.loads(ans)
    answer = json.loads(response["answer"])
    return answer == "correct"
]]>
        </script>
        <jsinput
            gradefn="QuizApp.getGrade"
            get_statefn="QuizApp.getState"
            set_statefn="QuizApp.setState"
            initial_state='{}'
            width="100%"
            height="500"
            html_file="/asset-v1:path+to+your+quiz+file"
            title="Fill-in-the-blank Quiz"
            sop="false"
        />
    </customresponse>
</problem>`;

export default quizResponse; 